import { hasTransparency } from "$lib/core/analyze";
import type { OutputMime } from "$lib/core/io";
import type { PixelImage } from "$lib/core/types";
import { outputFormatByMime } from "$lib/output-formats";
import type { ChainStep } from "$lib/pipeline.svelte";
import type { Tool } from "$lib/registry";

export interface OutputControlsCtx {
	lastTool: () => Tool;
	steps: () => ChainStep[];
	result: () => PixelImage | null;
	setStepValue: (index: number, id: string, value: unknown) => void;
}

// Download controls of SchemaToolView: output format, lossy quality and the
// optional size limit, plus the alpha-loss warning for the current format.
export function createOutputControls(ctx: OutputControlsCtx) {
	let format = $state<OutputMime>("image/png");
	// Lossy-format quality for tools without a quality param in the schema.
	let formatQuality = $state<Record<string, number>>({});
	// Optional download size limit (KB); undefined = no limit.
	let limitKb = $state<number | undefined>(undefined);

	// If the last step's schema has a quality param (convert tools), it is the
	// single source of quality; the dropdown edits the same value.
	const qualityParamId = $derived(ctx.lastTool().output?.qualityParamId);
	const lastParams = $derived(ctx.steps().at(-1)?.params);
	const quality = $derived.by(() => {
		const setting = outputFormatByMime(format).settings?.quality;
		if (!setting) return undefined;
		if (qualityParamId && lastParams) return Number(lastParams[qualityParamId]);
		return formatQuality[format] ?? setting.default;
	});
	const alphaLoss = $derived.by(() => {
		const result = ctx.result();
		return (
			(ctx.lastTool().result ?? "image") === "image" &&
			result !== null &&
			!outputFormatByMime(format).supportsAlpha &&
			hasTransparency(result)
		);
	});

	return {
		get format() {
			return format;
		},
		set format(v: OutputMime) {
			format = v;
		},
		get quality() {
			return quality;
		},
		get limitKb() {
			return limitKb;
		},
		set limitKb(v: number | undefined) {
			limitKb = v;
		},
		get alphaLoss() {
			return alphaLoss;
		},
		setQuality: (q: number) => {
			if (qualityParamId) {
				ctx.setStepValue(ctx.steps().length - 1, qualityParamId, q);
			} else {
				formatQuality = { ...formatQuality, [format]: q };
			}
		},
	};
}
