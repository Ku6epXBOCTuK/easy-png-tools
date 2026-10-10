import { ToolError, type ErrorVars } from "$lib/core/errors";
import {
	downloadBlob,
	encode,
	fitWithinBytes,
	type OutputMime,
} from "$lib/core/io";
import { outputFormatByMime } from "$lib/output-formats";
import type { PixelImage } from "$lib/core/types";
import { execute } from "$lib/executor";
import { chainStepTitle, verdictText } from "$lib/i18n/schema-tool-strings";
import { t } from "$lib/i18n/t";
import type { ChainStep } from "$lib/pipeline.svelte";
import type {
	FileResult,
	Tool,
	ToolImageFile,
	ToolResult,
} from "$lib/registry";
import type { Dimension, ToolSchema } from "$lib/registry-schema";
import {
	baseName,
	ChainStepError,
	runChain,
	type ChainWarning,
} from "$lib/run-chain";
import { downloadZip } from "$lib/zip";

export type DisplayError =
	| { kind: "i18n"; key: string; vars?: ErrorVars }
	| { kind: "plain"; text: string };

export interface SchemaToolRunnerCtx {
	pageSlug: () => string;
	schema: () => ToolSchema<Record<string, unknown>> | undefined;
	steps: () => ChainStep[];
	source: () => PixelImage | null;
	sourceFiles: () => ToolImageFile[];
	textSource: () => string;
	format: () => OutputMime;
	quality: () => number | undefined;
	limitKb: () => number | undefined;
	lastTool: () => Tool;
}

interface RunnerState {
	running: boolean;
	// Generation of the latest run(): a stale in-flight chain (params changed
	// while the worker was busy) must not overwrite newer results.
	runGen: number;
	result: PixelImage | null;
	fileResult: FileResult | null;
	textResult: string | null;
	verdictVars: Record<string, string | number> | undefined;
	stepDims: (Dimension | undefined)[];
	stepResults: (PixelImage | null)[];
	// Full named set per step (batch/fan-out); intermediate tiles show a grid.
	stepFileSets: ToolImageFile[][];
	runWarnings: ChainWarning[];
	displayError: DisplayError | null;
}

function toDisplayError(e: unknown): DisplayError {
	if (e instanceof ToolError) {
		return { kind: "i18n", key: e.key, vars: e.vars };
	}
	if (e instanceof Error) return { kind: "plain", text: e.message };
	return { kind: "plain", text: String(e) };
}

function assignResult(s: RunnerState, out: ToolResult) {
	if (typeof out === "object" && out !== null && "files" in out) {
		s.fileResult = out;
		s.result = null;
		s.textResult = null;
		s.verdictVars = undefined;
	} else if (typeof out === "object" && out !== null && "data" in out) {
		s.result = out as PixelImage;
		s.fileResult = null;
		s.textResult = null;
		s.verdictVars = undefined;
	} else {
		if (typeof out === "string") {
			s.textResult = out;
			s.verdictVars = undefined;
		} else if (out && "key" in out) {
			s.textResult = out.key;
			s.verdictVars = out.vars;
		} else {
			s.textResult = null;
			s.verdictVars = undefined;
		}
		s.result = null;
		s.fileResult = null;
	}
}

async function run(s: RunnerState, ctx: SchemaToolRunnerCtx) {
	const schema = ctx.schema();
	const steps = ctx.steps();
	if (!schema || steps.length === 0) return;
	const gen = ++s.runGen;
	s.displayError = null;
	s.running = true;
	try {
		const source = ctx.source();
		const sourceFiles = ctx.sourceFiles();
		const textSource = ctx.textSource();
		const input =
			sourceFiles.length > 0
				? sourceFiles
				: source
					? [{ name: `${baseName(ctx.pageSlug())}.png`, image: source }]
					: [];
		const r = await runChain(steps, input, textSource || undefined, execute);
		if (gen !== s.runGen) return;
		s.stepDims = r.stepDims;
		s.stepResults = r.stepResults;
		s.stepFileSets = r.stepFileSets;
		s.runWarnings = r.warnings;
		assignResult(s, r.out);
	} catch (e) {
		if (gen !== s.runGen) return;
		if (e instanceof ChainStepError) {
			const base = toDisplayError(e.cause);
			const msg = base.kind === "i18n" ? t(base.key, base.vars) : base.text;
			s.displayError = {
				kind: "plain",
				text: t("toolPage.stepError", {
					n: e.stepIndex + 1,
					title: chainStepTitle(e.toolId),
					msg,
				}),
			};
		} else {
			s.displayError = toDisplayError(e);
		}
	} finally {
		if (gen === s.runGen) s.running = false;
	}
}

async function download(s: RunnerState, ctx: SchemaToolRunnerCtx) {
	if (!ctx.schema()) return;
	s.running = true;
	s.displayError = null;
	try {
		if (s.fileResult) {
			await downloadZip(s.fileResult.files, `${ctx.pageSlug()}.zip`);
			return;
		}
		if (!s.result) return;
		const out = outputFormatByMime(ctx.format());
		const q = ctx.quality();
		const limit = ctx.limitKb();
		const quality = q !== undefined ? q / 100 : undefined;
		const blob = limit
			? await fitWithinBytes(s.result, out.mime, limit * 1024, quality)
			: await encode(s.result, out.mime, quality);
		downloadBlob(blob, `${ctx.pageSlug()}.${out.ext}`);
	} catch (e) {
		s.displayError = toDisplayError(e);
	} finally {
		s.running = false;
	}
}

async function copyText(s: RunnerState, ctx: SchemaToolRunnerCtx) {
	if (!s.textResult) return;
	const tool = ctx.lastTool();
	const copyValue =
		(tool.result ?? "image") === "verdict"
			? verdictText(tool.id, s.textResult, s.verdictVars)
			: s.textResult;
	try {
		await navigator.clipboard.writeText(copyValue);
	} catch (e) {
		s.displayError = toDisplayError(e);
	}
}

async function downloadText(s: RunnerState, ctx: SchemaToolRunnerCtx) {
	if (!s.textResult) return;
	try {
		const blob = new Blob([s.textResult], { type: "text/plain" });
		downloadBlob(blob, `${ctx.pageSlug()}.txt`);
	} catch (e) {
		s.displayError = toDisplayError(e);
	}
}

function clearResults(s: RunnerState) {
	s.result = null;
	s.fileResult = null;
	s.textResult = null;
	s.verdictVars = undefined;
	s.displayError = null;
}

// Execution state and actions of SchemaToolView: run/download/clipboard and
// all results. Owns the generation counter (see RunnerState.runGen).
export function createSchemaToolRunner(ctx: SchemaToolRunnerCtx) {
	const s = $state<RunnerState>({
		running: false,
		runGen: 0,
		result: null,
		fileResult: null,
		textResult: null,
		verdictVars: undefined,
		stepDims: [],
		stepResults: [],
		stepFileSets: [],
		runWarnings: [],
		displayError: null,
	});
	return {
		get running() {
			return s.running;
		},
		get result() {
			return s.result;
		},
		get fileResult() {
			return s.fileResult;
		},
		get textResult() {
			return s.textResult;
		},
		get verdictVars() {
			return s.verdictVars;
		},
		get stepDims() {
			return s.stepDims;
		},
		get stepResults() {
			return s.stepResults;
		},
		get stepFileSets() {
			return s.stepFileSets;
		},
		get runWarnings() {
			return s.runWarnings;
		},
		get displayError() {
			return s.displayError;
		},
		set displayError(v: DisplayError | null) {
			s.displayError = v;
		},
		run: () => run(s, ctx),
		download: () => download(s, ctx),
		copyText: () => copyText(s, ctx),
		downloadText: () => downloadText(s, ctx),
		// Host changed (another page/chain): drop run state and invalidate any
		// in-flight run from the previous host.
		resetForHost: () => {
			s.runGen++;
			s.runWarnings = [];
			s.stepFileSets = [];
			clearResults(s);
		},
		clearResults: () => clearResults(s),
		reportError: (e: unknown) => {
			s.displayError = toDisplayError(e);
		},
	};
}
