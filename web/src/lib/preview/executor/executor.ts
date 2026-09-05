import { ToolError } from "$lib/core/errors";
import type { PixelImage } from "$lib/core/types";

type MaybeRunnable = {
	id: string;
	domOnly?: boolean;
	run?: (
		img: PixelImage,
		params: Record<string, unknown>,
	) => Promise<PixelImage> | PixelImage;
	generate?: (
		params: Record<string, unknown>,
	) => Promise<PixelImage> | PixelImage;
};

export async function executeStep(
	tool: MaybeRunnable,
	img: PixelImage,
	params: Record<string, unknown>,
): Promise<PixelImage> {
	if (!tool.run) {
		throw new Error("errors.noImageRun");
	}
	if (tool.domOnly) {
		return await runDirect(tool, img, params);
	}
	if (typeof Worker === "undefined") {
		return await runDirect(tool, img, params);
	}
	const worker = ensureWorker();
	if (worker === null) {
		return await runDirect(tool, img, params);
	}
	try {
		return await runInWorker(worker, tool.id, img, params);
	} catch (workerError) {
		disableWorker();
		void workerError;
		return await runDirect(tool, img, params);
	}
}

/**
 * Применение инструмента-генератора (без входного изображения).
 * Выполняется напрямую: worker-протокол рассчитан на передачу исходника,
 * а генераторам вход не нужен.
 */
export async function executeGenerate(
	tool: MaybeRunnable,
	params: Record<string, unknown>,
): Promise<PixelImage> {
	if (!tool.generate) {
		throw new Error("errors.noGenerate");
	}
	return await tool.generate(params);
}

async function runDirect(
	tool: MaybeRunnable,
	img: PixelImage,
	params: Record<string, unknown>,
): Promise<PixelImage> {
	if (!tool.run) {
		throw new Error("errors.noImageRun");
	}
	return await tool.run(img, params);
}

let worker: Worker | null = null;
let workerTried = false;
let nextRequestId = 1;
const pending = new Map<
	number,
	{ resolve: (img: PixelImage) => void; reject: (e: Error) => void }
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
	toolId: string,
	img: PixelImage,
	params: Record<string, unknown>,
): Promise<PixelImage> {
	return new Promise((resolve, reject) => {
		const id = nextRequestId++;
		pending.set(id, { resolve, reject });
		workerInstance.postMessage({
			id,
			toolId,
			image: {
				width: img.width,
				height: img.height,
				data: new Uint8ClampedArray(img.data),
			},
			params,
		});
	});
}
