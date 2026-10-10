import { ToolError } from "../core/errors";
import type { PixelImage } from "../core/types";
import type { ToolContext, Tool, ToolResult } from "../registry";
import { sanitizeSchemaParams } from "../registry-schema";
import {
	decodeWorkerResponse,
	isWorkerResponse,
	type WorkerRequest,
	type WorkerResponse,
} from "./protocol";

export type ExecuteContext = {
	params: Record<string, unknown>;
	source?: PixelImage;
	text?: string;
};

export type WorkerLike = {
	postMessage(message: WorkerRequest): void;
	terminate(): void;
	onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null;
	onerror: ((event: Event) => void) | null;
};

export type WorkerFactory = () => WorkerLike;

type PendingRequest = {
	resolve: (result: ToolResult) => void;
	reject: (error: unknown) => void;
};

function defaultWorkerFactory(): WorkerLike {
	// Worker's onerror is typed with ErrorEvent while WorkerLike expects Event;
	// the DOM lib types are incompatible, hence the double cast.
	return new Worker(new URL("./executor.worker.ts", import.meta.url), {
		type: "module",
	}) as unknown as WorkerLike;
}

export function createExecutor(
	options: { workerFactory?: WorkerFactory } = {},
): (tool: Tool, ctx: ExecuteContext) => Promise<ToolResult> {
	const workerFactory = options.workerFactory ?? defaultWorkerFactory;
	let worker: WorkerLike | null = null;
	let workerTried = false;
	let nextRequestId = 1;
	const pending = new Map<number, PendingRequest>();

	function failWorker(candidate: WorkerLike, error: unknown): void {
		if (worker === candidate) worker = null;
		candidate.terminate();
		for (const [id, entry] of pending) {
			pending.delete(id);
			entry.reject(error);
		}
	}

	function ensureWorker(): WorkerLike | null {
		if (workerTried) return worker;
		workerTried = true;
		let candidate: WorkerLike | undefined;
		try {
			candidate = workerFactory();
			candidate.onmessage = (event) => {
				const payload: unknown = event.data;
				if (!isWorkerResponse(payload)) {
					failWorker(
						candidate as WorkerLike,
						new Error("Invalid worker response"),
					);
					return;
				}
				const entry = pending.get(payload.id);
				if (!entry) return;
				try {
					const result = decodeWorkerResponse(payload);
					pending.delete(payload.id);
					entry.resolve(result);
				} catch (error) {
					if (error instanceof ToolError) {
						pending.delete(payload.id);
						entry.reject(error);
					} else {
						failWorker(candidate as WorkerLike, error);
					}
				}
			};
			candidate.onerror = () => {
				failWorker(candidate as WorkerLike, new Error("Worker error"));
			};
			worker = candidate;
			return candidate;
		} catch (error) {
			candidate?.terminate();
			worker = null;
			return null;
		}
	}

	function disableWorker(candidate: WorkerLike): void {
		if (worker !== candidate) return;
		worker = null;
		candidate.terminate();
	}

	async function runDirect(
		tool: Tool,
		ctx: ExecuteContext,
	): Promise<ToolResult> {
		return await tool.run(ctx as ToolContext<Record<string, unknown>>);
	}

	function runInWorker(
		candidate: WorkerLike,
		tool: Tool,
		ctx: ExecuteContext,
	): Promise<ToolResult> {
		return new Promise((resolve, reject) => {
			const id = nextRequestId++;
			pending.set(id, { resolve, reject });
			try {
				candidate.postMessage({
					id,
					toolId: tool.id,
					params: ctx.params,
					source: ctx.source
						? {
								width: ctx.source.width,
								height: ctx.source.height,
								data: new Uint8ClampedArray(ctx.source.data),
							}
						: undefined,
					text: ctx.text,
				});
			} catch (error) {
				failWorker(candidate, error);
			}
		});
	}

	async function route(tool: Tool, ctx: ExecuteContext): Promise<ToolResult> {
		if (tool.domOnly) return await runDirect(tool, ctx);
		const candidate = ensureWorker();
		if (candidate === null) return await runDirect(tool, ctx);
		try {
			return await runInWorker(candidate, tool, ctx);
		} catch (error) {
			if (error instanceof ToolError) throw error;
			disableWorker(candidate);
			return await runDirect(tool, ctx);
		}
	}

	return async (tool, ctx) => {
		const params = sanitizeSchemaParams(tool.schema, ctx.params, {
			source: ctx.source,
		});
		if (tool.input === "image" && !ctx.source) {
			throw new ToolError("errors.sourceRequired");
		}
		if (tool.input === "text" && !ctx.text?.trim()) {
			throw new ToolError("errors.textRequired");
		}
		return await route(tool, { ...ctx, params });
	};
}

export const execute = createExecutor();
