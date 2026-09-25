import { ToolError, type ErrorVars } from "../core/errors";
import type { FileResult, ToolResult } from "../registry";

export type WorkerImage = {
	width: number;
	height: number;
	data: Uint8ClampedArray;
};

export type WorkerFile = {
	name: string;
	width: number;
	height: number;
	data: Uint8ClampedArray;
};

export type WorkerRequest = {
	id: number;
	toolId: string;
	params: Record<string, unknown>;
	source?: WorkerImage;
	text?: string;
};

export type WorkerResponse =
	| {
			id: number;
			ok: true;
			width?: number;
			height?: number;
			data?: Uint8ClampedArray;
			text?: string;
			textVars?: ErrorVars;
			files?: WorkerFile[];
	  }
	| {
			id: number;
			ok: false;
			error?: string;
			errorKey?: string;
			errorVars?: ErrorVars;
	  };

export type WorkerResult = {
	response: WorkerResponse;
	transfer: Transferable[];
};

function transferables(...values: Uint8ClampedArray[]): Transferable[] {
	return values.map((value) => value.buffer as ArrayBuffer);
}

export function isWorkerResponse(value: unknown): value is WorkerResponse {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as { id?: unknown; ok?: unknown };
	return typeof candidate.id === "number" && typeof candidate.ok === "boolean";
}

export function encodeWorkerResponse(
	id: number,
	result: ToolResult,
): WorkerResult {
	if (typeof result === "string") {
		return { response: { id, ok: true, text: result }, transfer: [] };
	}
	if ("key" in result) {
		return {
			response: { id, ok: true, text: result.key, textVars: result.vars },
			transfer: [],
		};
	}
	if ("files" in result) {
		const files = result.files.map((file) => ({
			name: file.name,
			width: file.image.width,
			height: file.image.height,
			data: file.image.data,
		}));
		return {
			response: { id, ok: true, files },
			transfer: transferables(...files.map((file) => file.data)),
		};
	}
	return {
		response: {
			id,
			ok: true,
			width: result.width,
			height: result.height,
			data: result.data,
		},
		transfer: transferables(result.data),
	};
}

export function encodeWorkerError(id: number, error: unknown): WorkerResult {
	const toolError = error instanceof ToolError ? error : undefined;
	return {
		response: {
			id,
			ok: false,
			error: error instanceof Error ? error.message : String(error),
			errorKey: toolError?.key,
			errorVars: toolError?.vars,
		},
		transfer: [],
	};
}

function isWorkerFile(value: WorkerFile): boolean {
	return (
		typeof value.name === "string" &&
		typeof value.width === "number" &&
		typeof value.height === "number" &&
		value.data instanceof Uint8ClampedArray
	);
}

export function decodeWorkerResponse(payload: WorkerResponse): ToolResult {
	if (payload.ok) {
		if (
			typeof payload.width === "number" &&
			typeof payload.height === "number" &&
			payload.data instanceof Uint8ClampedArray
		) {
			return {
				width: payload.width,
				height: payload.height,
				data: new Uint8ClampedArray(payload.data),
			};
		}
		if (Array.isArray(payload.files)) {
			if (!payload.files.every(isWorkerFile)) {
				throw new Error("Invalid worker response");
			}
			return {
				files: payload.files.map((file) => ({
					name: file.name,
					image: {
						width: file.width,
						height: file.height,
						data: new Uint8ClampedArray(file.data),
					},
				})),
			} satisfies FileResult;
		}
		if (typeof payload.text === "string") {
			return payload.textVars
				? { key: payload.text, vars: payload.textVars }
				: payload.text;
		}
		throw new Error("Invalid worker response");
	}
	if (payload.errorKey) {
		throw new ToolError(payload.errorKey, payload.errorVars);
	}
	if (payload.error?.startsWith("errors.")) {
		throw new ToolError(payload.error);
	}
	throw new Error(payload.error ?? "Invalid worker response");
}
