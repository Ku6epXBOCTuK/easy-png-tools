import { describe, expect, it, vi } from "vitest";
import { ToolError } from "../core/errors";
import type { PixelImage } from "../core/types";
import {
	createExecutor,
	type ExecuteContext,
	type WorkerFactory,
	type WorkerLike,
} from "./executor";
import {
	decodeWorkerResponse,
	encodeWorkerResponse,
	type WorkerRequest,
	type WorkerResponse,
} from "./protocol";
import { handleWorkerRequest } from "./worker-handler";
import { field, toolSchema, type Dimension } from "../registry-schema";
import type { ToolEntry } from "../registry";

class FakeWorker implements WorkerLike {
	onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;
	requests: WorkerRequest[] = [];
	terminated = false;
	throwOnPost = false;

	postMessage(request: WorkerRequest): void {
		this.requests.push(request);
		if (this.throwOnPost) throw new Error("post failed");
	}

	respond(response: WorkerResponse): void {
		this.onmessage?.({ data: response } as MessageEvent<WorkerResponse>);
	}

	fail(): void {
		this.onerror?.(new Event("error"));
	}

	terminate(): void {
		this.terminated = true;
	}
}

function createFactory(throwOnPost = false): {
	factory: WorkerFactory;
	workers: FakeWorker[];
} {
	const workers: FakeWorker[] = [];
	return {
		factory: () => {
			const worker = new FakeWorker();
			worker.throwOnPost = throwOnPost;
			workers.push(worker);
			return worker;
		},
		workers,
	};
}

const emptySchema = toolSchema<Record<string, never>>({});

function makeTool(
	run: ToolEntry["run"] = () => "direct",
	overrides: Partial<ToolEntry> = {},
): ToolEntry {
	return {
		id: "test-tool",
		title: "Test tool",
		description: "Test tool",
		category: "analyze",
		schema: emptySchema,
		input: "none",
		run,
		...overrides,
	};
}

function image(width = 2, height = 2): WorkerRequest["source"] {
	return {
		width,
		height,
		data: new Uint8ClampedArray(width * height * 4),
	};
}

describe("createExecutor", () => {
	it("validates required input before creating a worker", async () => {
		const factory = vi.fn<WorkerFactory>();
		const execute = createExecutor({ workerFactory: factory });
		const imageTool = makeTool(vi.fn(), { input: "image" });
		const textTool = makeTool(vi.fn(), { input: "text" });

		await expect(execute(imageTool, { params: {} })).rejects.toMatchObject({
			key: "errors.sourceRequired",
		});
		await expect(
			execute(textTool, { params: {}, text: "  " }),
		).rejects.toMatchObject({ key: "errors.textRequired" });
		expect(factory).not.toHaveBeenCalled();
	});

	it("routes domOnly tools directly", async () => {
		const { factory, workers } = createFactory();
		const execute = createExecutor({ workerFactory: factory });
		const run = vi.fn(() => "direct");
		const tool = makeTool(run, { domOnly: true });

		await expect(execute(tool, { params: {} })).resolves.toBe("direct");
		expect(workers).toHaveLength(0);
	});

	it("passes source-aware sanitized params through the worker request", async () => {
		const { factory, workers } = createFactory();
		const execute = createExecutor({ workerFactory: factory });
		const schema = toolSchema<{ size: Dimension }>({
			size: field.dimension({
				min: 1,
				max: 100,
				width: 1,
				height: 1,
				defaultFromSource: true,
			}),
		});
		const tool = makeTool(() => "worker", { input: "image", schema });
		const promise = execute(tool, {
			params: { size: { width: 0, height: 0 } },
			source: image(64, 48) as ExecuteContext["source"],
		});
		const worker = workers[0];
		const request = worker.requests[0];
		worker.respond({ id: request.id, ok: true, text: "worker" });

		await expect(promise).resolves.toBe("worker");
		expect(request.params).toEqual({ size: { width: 64, height: 48 } });
	});

	it("resolves concurrent worker responses by request id", async () => {
		const { factory, workers } = createFactory();
		const execute = createExecutor({ workerFactory: factory });
		const tool = makeTool();
		const first = execute(tool, { params: {} });
		const second = execute(tool, { params: {} });
		const worker = workers[0];
		const [firstRequest, secondRequest] = worker.requests;

		worker.respond({ id: secondRequest.id, ok: true, text: "second" });
		worker.respond({ id: firstRequest.id, ok: true, text: "first" });

		await expect(first).resolves.toBe("first");
		await expect(second).resolves.toBe("second");
	});

	it("does not retry a worker ToolError directly", async () => {
		const { factory, workers } = createFactory();
		const execute = createExecutor({ workerFactory: factory });
		const run = vi.fn(() => "direct");
		const tool = makeTool(run);
		const promise = execute(tool, { params: {} });
		const worker = workers[0];
		const request = worker.requests[0];
		worker.respond({
			id: request.id,
			ok: false,
			errorKey: "errors.badPixelToken",
			errorVars: { value: "x" },
		});

		await expect(promise).rejects.toMatchObject({
			key: "errors.badPixelToken",
			vars: { value: "x" },
		});
		expect(run).not.toHaveBeenCalled();
	});

	it("falls back when worker construction fails", async () => {
		const factory = vi.fn<WorkerFactory>(() => {
			throw new Error("construction failed");
		});
		const execute = createExecutor({ workerFactory: factory });
		const run = vi.fn(() => "direct");
		const tool = makeTool(run);

		await expect(execute(tool, { params: {} })).resolves.toBe("direct");
		await expect(execute(tool, { params: {} })).resolves.toBe("direct");
		expect(factory).toHaveBeenCalledTimes(1);
		expect(run).toHaveBeenCalledTimes(2);
	});

	it("falls back after transport failures and disables the worker", async () => {
		const { factory, workers } = createFactory(true);
		const execute = createExecutor({ workerFactory: factory });
		const run = vi.fn(() => "direct");
		const tool = makeTool(run);

		const postFailure = execute(tool, { params: {} });
		await expect(postFailure).resolves.toBe("direct");
		expect(workers[0].terminated).toBe(true);

		await expect(execute(tool, { params: {} })).resolves.toBe("direct");
		expect(workers).toHaveLength(1);
	});

	it("falls back after onerror and malformed responses", async () => {
		for (const failure of ["error", "malformed"] as const) {
			const { factory, workers } = createFactory();
			const execute = createExecutor({ workerFactory: factory });
			const tool = makeTool(() => "direct");
			const promise = execute(tool, { params: {} });
			const worker = workers[0];
			if (failure === "error") {
				worker.fail();
			} else {
				worker.respond({ id: worker.requests[0].id, ok: true });
			}
			await expect(promise).resolves.toBe("direct");
			expect(worker.terminated).toBe(true);
		}
	});

	it("decodes image, verdict, and files worker responses", () => {
		const data = new Uint8ClampedArray([1, 2, 3, 4]);
		const imageResult = decodeWorkerResponse({
			id: 1,
			ok: true,
			width: 1,
			height: 1,
			data,
		});
		expect(imageResult).toMatchObject({ width: 1, height: 1 });

		const verdict = decodeWorkerResponse({
			id: 2,
			ok: true,
			text: "line",
			textVars: { kb: "1" },
		});
		expect(verdict).toEqual({ key: "line", vars: { kb: "1" } });

		const files = decodeWorkerResponse({
			id: 3,
			ok: true,
			files: [{ name: "part.png", width: 1, height: 1, data }],
		});
		expect(files).toMatchObject({
			files: [{ name: "part.png", image: { width: 1, height: 1 } }],
		});
	});

	it("round-trips FileResult through the worker protocol", () => {
		const fileImage: PixelImage = {
			width: 1,
			height: 1,
			data: new Uint8ClampedArray([1, 2, 3, 4]),
		};
		const fileResult = {
			files: [{ name: "part-1-1.png", image: fileImage }],
		};
		const encoded = encodeWorkerResponse(4, fileResult);

		expect(encoded.transfer).toHaveLength(1);
		expect(decodeWorkerResponse(encoded.response)).toEqual(fileResult);
	});

	it("falls back when a files payload is malformed", async () => {
		const { factory, workers } = createFactory();
		const execute = createExecutor({ workerFactory: factory });
		const tool = makeTool(() => "direct");
		const promise = execute(tool, { params: {} });
		const worker = workers[0];
		const request = worker.requests[0];
		worker.respond({
			id: request.id,
			ok: true,
			files: [{ name: "part.png", width: 1, height: 1 }],
		} as unknown as WorkerResponse);

		await expect(promise).resolves.toBe("direct");
		expect(worker.terminated).toBe(true);
	});
});

describe("handleWorkerRequest", () => {
	it("serializes image results and preserves ToolError keys", async () => {
		const imageResult = await handleWorkerRequest({
			id: 1,
			toolId: "flip-png",
			params: {},
			source: image(),
		});
		expect(imageResult.response).toMatchObject({
			id: 1,
			ok: true,
			width: 2,
			height: 2,
		});
		expect(imageResult.transfer).toHaveLength(1);

		const errorResult = await handleWorkerRequest({
			id: 2,
			toolId: "bytes-to-png",
			params: { width: 32 },
			text: Array.from({ length: 132 }, () => "1").join(" "),
		});
		expect(errorResult.response).toMatchObject({
			id: 2,
			ok: false,
			errorKey: "errors.pixelCountMismatch",
			errorVars: { count: 33, width: 32 },
		});
	});

	it("serializes FileResult transfers", async () => {
		const result = await handleWorkerRequest({
			id: 3,
			toolId: "split-into-parts-png",
			params: { columns: 2, rows: 2 },
			source: image(),
		});
		expect(result.response).toMatchObject({ id: 3, ok: true });
		expect(result.transfer).toHaveLength(4);
	});
});
