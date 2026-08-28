/// <reference lib="webworker" />
import type { PixelImage } from "../core/types";
import { ToolError } from "../core/errors";
import { getTool, sanitizeParams } from "../registry";

type WorkerRequest = {
	id: number;
	toolId: string;
	image: { width: number; height: number; data: Uint8ClampedArray };
	params: Record<string, unknown>;
};

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
	void handle(event.data);
};

async function handle(request: WorkerRequest): Promise<void> {
	try {
		const tool = getTool(request.toolId);
		if (!tool?.run) {
			throw new Error("errors.noImageRun");
		}
		const image: PixelImage = {
			width: request.image.width,
			height: request.image.height,
			data: new Uint8ClampedArray(request.image.data),
		};
		const output = await tool.run(image, sanitizeParams(tool, request.params));
		const payload = {
			id: request.id,
			ok: true,
			width: output.width,
			height: output.height,
			data: output.data,
		};
		(self as unknown as Worker).postMessage(payload, [output.data.buffer]);
	} catch (e) {
		const toolError = e instanceof ToolError ? e : undefined;
		(self as unknown as Worker).postMessage({
			id: request.id,
			ok: false,
			error: e instanceof Error ? e.message : String(e),
			errorKey: toolError?.key,
			errorVars: toolError?.vars,
		});
	}
}
