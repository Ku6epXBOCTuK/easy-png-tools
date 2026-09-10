import { ToolError } from "$lib/core/errors";
import type { PixelImage } from "$lib/core/types";
import type { ToolContext, ToolEntry, ToolResult } from "$lib/registry";
import { sanitizeSchemaParams } from "$lib/registry-schema";

/** Вход единой точки исполнения. `source`/`text` — по контракту `tool.input`. */
export type ExecuteContext = {
	params: Record<string, unknown>;
	source?: PixelImage;
	text?: string;
};

/**
 * Единственная точка исполнения инструмента. Валидирует наличие входа по
 * `tool.input`, санитит параметры и запускает `tool.run`. Выбор места
 * исполнения (worker/поток) — внутренняя забота executor'а, диспетча методов
 * нет: у любого инструмента один `run(ctx)`.
 */
export async function execute(
	tool: ToolEntry,
	ctx: ExecuteContext,
): Promise<ToolResult> {
	const params = sanitizeSchemaParams(tool.schema, ctx.params);
	if (tool.input === "image" && !ctx.source) {
		throw new ToolError("errors.sourceRequired");
	}
	if (tool.input === "text" && !ctx.text?.trim()) {
		throw new ToolError("errors.textRequired");
	}
	return route(tool, { params, source: ctx.source, text: ctx.text });
}

/**
 * Маршрутизация по способу исполнения. В worker уходит всё, кроме
 * domOnly-инструментов: даже текстовые вердикты могут быть тяжёлыми
 * (гистограммы, сложный анализ), поэтому ограничивать по типу результата
 * неверно. Ограничение одно — доступ к DOM, которого в worker нет.
 */
async function route(
	tool: ToolEntry,
	ctx: ExecuteContext,
): Promise<ToolResult> {
	if (tool.domOnly || typeof Worker === "undefined") {
		return await runDirect(tool, ctx);
	}
	const worker = ensureWorker();
	if (worker === null) {
		return await runDirect(tool, ctx);
	}
	try {
		return await runInWorker(worker, tool, ctx);
	} catch (workerError) {
		disableWorker();
		void workerError;
		return await runDirect(tool, ctx);
	}
}

async function runDirect(
	tool: ToolEntry,
	ctx: ExecuteContext,
): Promise<ToolResult> {
	return await tool.run(ctx as ToolContext<Record<string, unknown>>);
}

let worker: Worker | null = null;
let workerTried = false;
let nextRequestId = 1;
const pending = new Map<
	number,
	{ resolve: (result: ToolResult) => void; reject: (e: Error) => void }
>();

function ensureWorker(): Worker | null {
	if (workerTried) return worker;
	workerTried = true;
	try {
		const candidate = new Worker(
			new URL("./executor.worker.ts", import.meta.url),
			{
				type: "module",
			},
		);
		candidate.onmessage = (event: MessageEvent) => {
			const payload = event.data as {
				id: number;
				ok: boolean;
				width?: number;
				height?: number;
				data?: Uint8ClampedArray;
				text?: string;
				error?: string;
				errorKey?: string;
				errorVars?: Record<string, string | number>;
			};
			const entry = pending.get(payload.id);
			if (!entry) return;
			pending.delete(payload.id);
			if (payload.ok && payload.data && payload.width && payload.height) {
				entry.resolve({
					width: payload.width,
					height: payload.height,
					data: new Uint8ClampedArray(payload.data),
				});
			} else if (payload.ok && typeof payload.text === "string") {
				entry.resolve(payload.text);
			} else if (payload.errorKey) {
				entry.reject(new ToolError(payload.errorKey, payload.errorVars));
			} else {
				entry.reject(new Error(payload.error ?? "errors.workerFailed"));
			}
		};
		candidate.onerror = () => {
			worker = null;
			for (const entry of pending.values()) {
				entry.reject(new Error("errors.workerUnavailable"));
			}
			pending.clear();
		};
		worker = candidate;
	} catch {
		worker = null;
	}
	return worker;
}

function disableWorker(): void {
	if (worker) {
		worker.terminate();
	}
	worker = null;
}

function runInWorker(
	workerInstance: Worker,
	tool: ToolEntry,
	ctx: ExecuteContext,
): Promise<ToolResult> {
	return new Promise((resolve, reject) => {
		const id = nextRequestId++;
		pending.set(id, { resolve, reject });
		workerInstance.postMessage({
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
	});
}
