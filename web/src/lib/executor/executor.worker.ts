/// <reference lib="webworker" />
import { ToolError } from "$lib/core/errors";
import type { PixelImage } from "$lib/core/types";
import { getTool } from "$lib/registry-new";
import { sanitizeSchemaParams } from "$lib/registry-schema";

type WorkerRequest = {
	id: number;
	toolId: string;
	params: Record<string, unknown>;
	source?: { width: number; height: number; data: Uint8ClampedArray };
	text?: string;
};

type WorkerResponse =
	| {
			id: number;
			ok: true;
			width?: number;
			height?: number;
			data?: Uint8ClampedArray;
			text?: string;
	  }
	| {
			id: number;
			ok: false;
			error?: string;
			errorKey?: string;
			errorVars?: Record<string, string | number>;
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
		const source: PixelImage | undefined = request.source
			? {
					width: request.source.width,
					height: request.source.height,
					data: new Uint8ClampedArray(request.source.data),
				}
			: undefined;
		const output = await tool.run({
			params: sanitizeSchemaParams(tool.schema, request.params),
			source,
			text: request.text,
		});
		if (typeof output === "string") {
			(self as unknown as Worker).postMessage({
				id: request.id,
				ok: true,
				text: output,
			} satisfies WorkerResponse);
			return;
		}
		(self as unknown as Worker).postMessage(
			{
				id: request.id,
				ok: true,
				width: output.width,
				height: output.height,
				data: output.data,
			} satisfies WorkerResponse,
			[output.data.buffer],
		);
	} catch (e) {
		const toolError = e instanceof ToolError ? e : undefined;
		(self as unknown as Worker).postMessage({
			id: request.id,
			ok: false,
			error: e instanceof Error ? e.message : String(e),
			errorKey: toolError?.key,
			errorVars: toolError?.vars,
		} satisfies WorkerResponse);
	}
}
