import { ToolError } from "../core/errors";

export function num(params: Record<string, unknown>, id: string): number {
	const v = params[id];
	if (typeof v !== "number" || !Number.isFinite(v)) {
		throw new ToolError("errors.paramNumber", { id });
	}
	return v;
}

export function str(params: Record<string, unknown>, id: string): string {
	const v = params[id];
	if (typeof v !== "string") {
		throw new ToolError("errors.paramString", { id });
	}
	return v;
}

export function bool(params: Record<string, unknown>, id: string): boolean {
	const v = params[id];
	if (typeof v !== "boolean") {
		throw new ToolError("errors.paramBool", { id });
	}
	return v;
}
