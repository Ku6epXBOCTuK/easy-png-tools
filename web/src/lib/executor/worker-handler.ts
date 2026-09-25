import { ToolError } from "../core/errors";
import type { PixelImage } from "../core/types";
import { getTool } from "../registry";
import { sanitizeSchemaParams } from "../registry-schema";
import {
	encodeWorkerError,
	encodeWorkerResponse,
	type WorkerRequest,
	type WorkerResult,
} from "./protocol";

export async function handleWorkerRequest(
	request: WorkerRequest,
): Promise<WorkerResult> {
	try {
		const tool = getTool(request.toolId);
		if (!tool?.run) {
			throw new ToolError("errors.noImageRun");
		}
		const source: PixelImage | undefined = request.source
			? {
					width: request.source.width,
					height: request.source.height,
					data: new Uint8ClampedArray(request.source.data),
				}
			: undefined;
		const output = await tool.run({
			params: sanitizeSchemaParams(tool.schema, request.params, { source }),
			source,
			text: request.text,
		});
		return encodeWorkerResponse(request.id, output);
	} catch (error) {
		return encodeWorkerError(request.id, error);
	}
}
