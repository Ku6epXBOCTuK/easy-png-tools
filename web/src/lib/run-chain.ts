import type { PixelImage } from "./core/types";
import type { ExecuteContext } from "./executor";
import {
	getTool,
	type FileResult,
	type Tool,
	type ToolImageFile,
	type ToolResult,
} from "./registry";
import type { Dimension } from "./registry-schema";

export type ChainExecutor = (
	tool: Tool,
	ctx: ExecuteContext,
) => Promise<ToolResult>;

export type ChainWarning =
	| { kind: "partial"; step: number; ok: number; total: number }
	| { kind: "firstOnly"; step: number; total: number }
	| { kind: "sourceSkip"; skipped: number; total: number };

export class ChainStepError extends Error {
	constructor(
		readonly stepIndex: number,
		readonly toolId: string,
		readonly cause: unknown,
	) {
		super(`step ${stepIndex + 1} (${toolId}) failed`);
	}
}

export interface ChainRunOutput {
	stepResults: (PixelImage | null)[];
	/** Full named set per step; empty for text/verdict/none steps. */
	stepFileSets: ToolImageFile[][];
	stepDims: (Dimension | undefined)[];
	out: ToolResult;
	warnings: ChainWarning[];
}

/** Zip entries are encoded as PNG (see zip.ts), so names stay .png. */
export function baseName(name: string): string {
	return name.replace(/\.[^./\\]+$/, "");
}

export function glueName(parent: string, part: string): string {
	return `${baseName(parent)}-${part}`;
}

/**
 * Zip entries and keyed lists address files by name, so duplicates must not
 * occur: "image.png" repeated -> "image-2.png", "image-3.png".
 */
export function uniqueName(name: string, used: Set<string>): string {
	if (!used.has(name)) return name;
	const base = baseName(name);
	const ext = name.slice(base.length);
	for (let n = 2; ; n++) {
		const candidate = `${base}-${n}${ext}`;
		if (!used.has(candidate)) return candidate;
	}
}

function isImage(out: ToolResult): out is PixelImage {
	return typeof out === "object" && out !== null && "data" in out;
}

/**
 * Fan-out chain runner: image steps apply to every file of the set,
 * files-steps glue part names, analyze steps see only the first file.
 * A step fails the chain only when every file fails (ChainStepError).
 */
export async function runChain(
	steps: { id: string; params: Record<string, unknown> }[],
	source: ToolImageFile[],
	textSource: string | undefined,
	execute: ChainExecutor,
): Promise<ChainRunOutput> {
	const stepResults: (PixelImage | null)[] = [];
	const stepFileSets: ToolImageFile[][] = [];
	const stepDims: (Dimension | undefined)[] = [];
	const warnings: ChainWarning[] = [];
	let current: ToolImageFile[] = source;
	let out: ToolResult = "";

	for (let i = 0; i < steps.length; i++) {
		const tool = getTool(steps[i].id);
		if (!tool) continue;

		if (tool.input === "text" || tool.input === "none") {
			out = await execute(tool, {
				params: steps[i].params,
				text: tool.input === "text" ? textSource : undefined,
			});
			if (isImage(out)) {
				current = [{ name: tool.id, image: out }];
				stepResults[i] = out;
				stepFileSets[i] = current;
				stepDims[i] = { width: out.width, height: out.height };
			} else {
				current = [];
				stepResults[i] = null;
				stepFileSets[i] = [];
			}
			continue;
		}

		const analyze = tool.result === "text" || tool.result === "verdict";
		const inputs =
			analyze && current.length > 1 ? current.slice(0, 1) : current;
		if (analyze && current.length > 1) {
			warnings.push({ kind: "firstOnly", step: i + 1, total: current.length });
		}

		const produced: ToolImageFile[] = [];
		let failed = 0;
		let firstError: unknown;
		for (const file of inputs) {
			try {
				const res = await execute(tool, {
					params: steps[i].params,
					source: file.image,
				});
				out = res;
				if (isImage(res)) {
					produced.push({ name: file.name, image: res });
				} else if (typeof res === "object" && res !== null && "files" in res) {
					produced.push(
						...res.files.map((f) => ({
							name: glueName(file.name, f.name),
							image: f.image,
						})),
					);
				}
			} catch (e) {
				failed++;
				firstError ??= e;
			}
		}
		if (inputs.length > 0 && failed === inputs.length) {
			throw new ChainStepError(i, tool.id, firstError);
		}
		if (failed > 0) {
			warnings.push({
				kind: "partial",
				step: i + 1,
				ok: inputs.length - failed,
				total: inputs.length,
			});
		}
		current = produced;
		stepResults[i] = produced[0]?.image ?? null;
		stepFileSets[i] = produced;
		stepDims[i] = produced[0]
			? { width: produced[0].image.width, height: produced[0].image.height }
			: undefined;
	}

	if (current.length > 1) {
		out = { files: current } satisfies FileResult;
	} else if (current.length === 1) {
		out = current[0].image;
	}
	return { stepResults, stepFileSets, stepDims, out, warnings };
}
