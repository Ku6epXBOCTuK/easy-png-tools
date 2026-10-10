import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import {
	autoChainName,
	createNamedChain,
	getChain,
	stashHandoff,
	takeHandoff,
	updateChainSteps,
} from "$lib/chains.svelte";
import type { OutputMime } from "$lib/core/io";
import type { PixelImage } from "$lib/core/types";
import {
	createChain,
	isStructuralDefault,
	type ChainStep,
} from "$lib/pipeline.svelte";
import type { Page, Tool, ToolImageFile } from "$lib/registry";
import type { ToolSchema } from "$lib/registry-schema";
import { baseName } from "$lib/run-chain";

interface SourceLike {
	source: PixelImage | null;
	sourceFiles: ToolImageFile[];
	textSource: string;
	clearWarnings: () => void;
}

interface OutputLike {
	format: OutputMime;
	limitKb: number | undefined;
}

export interface ChainHostCtx {
	page: () => Page;
	chainId: () => string | undefined;
	schema: () => ToolSchema<Record<string, unknown>> | undefined;
	lastTool: () => Tool;
	steps: () => ChainStep[];
	stepState: { steps: ChainStep[]; clearMarks: () => void };
	source: SourceLike;
	output: OutputLike;
	// Drops run state and invalidates any in-flight run from the previous host.
	resetRun: () => void;
	clearMasks: () => void;
}

// Host lifecycle of SchemaToolView: per-host init (plain tool page vs named
// chain), handoff across the tool -> pipeline route swap, autosave into the
// chains store and the explicit "save as chain" action.
export function createChainHost(ctx: ChainHostCtx) {
	let initedFor = $state("");

	function init() {
		if (!ctx.schema()) return;
		const chainId = ctx.chainId();
		const host = chainId ? `chain:${chainId}` : ctx.page().slug;
		if (host === initedFor) return;
		initedFor = host;
		ctx.resetRun();
		if (chainId) {
			const handoff = takeHandoff(chainId);
			ctx.stepState.steps = getChain(chainId)?.steps ?? createChain(ctx.page());
			ctx.source.source = handoff?.source ?? null;
			ctx.source.sourceFiles =
				handoff?.sourceFiles ??
				(handoff?.source
					? [
							{
								name: `${baseName(ctx.page().slug)}.png`,
								image: handoff.source,
							},
						]
					: []);
			ctx.source.textSource = handoff?.textSource ?? "";
			ctx.output.format =
				handoff?.format ?? ctx.lastTool().output?.mime ?? "image/png";
			ctx.output.limitKb = handoff?.limitKb;
		} else {
			ctx.stepState.steps = createChain(ctx.page());
			ctx.output.format = ctx.lastTool().output?.mime ?? "image/png";
			ctx.output.limitKb = undefined;
			ctx.source.source = null;
			ctx.source.sourceFiles = [];
			ctx.source.textSource = "";
		}
		ctx.source.clearWarnings();
		ctx.clearMasks();
		ctx.stepState.clearMarks();
	}

	function openChain(steps: ChainStep[]) {
		const chain = createNamedChain(autoChainName(), steps);
		stashHandoff(chain.id, {
			source: ctx.source.source,
			sourceFiles: ctx.source.sourceFiles,
			textSource: ctx.source.textSource,
			format: ctx.output.format,
			limitKb: ctx.output.limitKb,
		});
		goto(resolve(`/pipeline?id=${chain.id}`), {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	}

	$effect(() => {
		init();
	});

	// Named-chain mode autosaves into the chains store; a plain tool page
	// persists nothing -- it becomes a named chain on structural change below.
	$effect(() => {
		const chainId = ctx.chainId();
		if (!initedFor || !chainId) return;
		void ctx.steps();
		updateChainSteps(chainId, ctx.steps());
	});

	// A tool page turns into a pipeline on the first structural change (step
	// added, first tool swapped): create the named chain and swap routes
	// seamlessly -- steps persist via the store, the source via the handoff.
	$effect(() => {
		if (!initedFor || ctx.chainId()) return;
		void ctx.steps();
		if (isStructuralDefault(ctx.page(), ctx.steps())) return;
		openChain(ctx.steps());
	});

	return {
		get inited() {
			return initedFor !== "";
		},
		// Explicit save for a structurally default chain (single tuned step):
		// the auto-create effect only fires on structural change.
		saveAsChain: () => openChain(ctx.steps()),
	};
}
