<script lang="ts">
	import { imageInfo, type ImageInfo } from "$lib/core/analyze";
	import { ToolError } from "$lib/core/errors";
	import {
		decodeFile,
		isSupportedImage,
		unsupportedImageError,
	} from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import { toolDescription, toolTitle } from "$lib/i18n/tool-strings";
	import {
		defaultParams,
		getTool,
		sanitizeParams,
		type ToolEntry,
	} from "$lib/v1/registry";
	import { createAutoRunner } from "$lib/v1/tools/auto-run";
	import { executeStep } from "$lib/v1/tools/executor";
	import { clearOverlay, setOverlay } from "$lib/v1/tools/overlay-store.svelte";
	import {
		loadStoredSteps,
		newStepId,
		saveSteps,
		type PipelineStep,
	} from "$lib/v1/tools/pipeline";
	import { TOOL_ICONS } from "$lib/v1/tools/tool-icons";
	import ChainToolBlock from "./chain/ChainToolBlock.svelte";
	import ToolSearch from "./search/ToolSearch.svelte";
	import type { StageStatus } from "./stage/stage-props";
	import ToolStage from "./stage/ToolStage.svelte";
	import ToolStageClassic from "./stage/ToolStageClassic.svelte";

	export type PresetStep = { toolId: string; values?: Record<string, unknown> };

	let {
		tool,
		restoreChain = false,
		stageVariant = "inline",
		presetBaseValues,
		presetChain,
	}: {
		tool: ToolEntry;
		restoreChain?: boolean;
		stageVariant?: "classic" | "inline";
		presetBaseValues?: Record<string, unknown>;
		presetChain?: PresetStep[];
	} = $props();

	const StageComponent = $derived(
		stageVariant === "classic" ? ToolStageClassic : ToolStage,
	);

	type Status = StageStatus;

	const isPreset = $derived(
		(presetChain?.length ?? 0) > 0 ||
			Object.keys(presetBaseValues ?? {}).length > 0,
	);

	let status = $state<Status>("idle");
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let previewResult = $state<PixelImage | null>(null);
	let textResult = $state<string | null>(null);
	let showMask = $state(false);
	let info = $state<ImageInfo | null>(null);
	let errorText = $state("");
	let overlayImage = $state<PixelImage | null>(null);
	// svelte-ignore state_referenced_locally
	let values = $state<Record<string, any>>({
		...defaultParams(tool),
		...presetBaseValues,
	});
	// svelte-ignore state_referenced_locally
	let chain = $state<PipelineStep[]>(
		restoreChain
			? loadStoredSteps()
			: (presetChain ?? []).flatMap((preset) => {
					const stepTool = getTool(preset.toolId);
					return stepTool
						? [
								{
									id: newStepId(),
									toolId: preset.toolId,
									values: { ...defaultParams(stepTool), ...preset.values },
								},
							]
						: [];
				}),
	);
	let chainResults = $state<(PixelImage | null)[]>([]);
	let lastRunChainJson = "";

	const isInfo = $derived(tool.resultType === "info");
	const isSourceless = $derived(tool.sourceMode === "none");
	const isTextSource = $derived(tool.sourceMode === "text");
	const sanitized = $derived(sanitizeParams(tool, values));
	const canChainBase = $derived(
		(tool.resultType ?? "image") === "image" && tool.sourceMode !== "text",
	);
	const hasMask = $derived(typeof tool.preview === "function");
	const shownBase = $derived(
		showMask && previewResult ? previewResult : result,
	);
	const hasFilledSteps = $derived(chain.some((step) => step.toolId !== ""));

	function addChainStep() {
		chain.push({ id: newStepId(), toolId: "", values: {} });
	}

	function removeChainStep(index: number) {
		chain.splice(index, 1);
		chainResults = [];
	}

	function removeChain() {
		chain.length = 0;
		chainResults = [];
	}

	function toggleChain() {
		if (chain.length > 0) {
			removeChain();
		} else {
			addChainStep();
		}
	}

	function applyChainTool(index: number, toolId: string) {
		const stepTool = getTool(toolId);
		if (!stepTool || !chain[index]) return;
		chain[index].toolId = toolId;
		chain[index].values = defaultParams(stepTool);
	}

	const runner = createAutoRunner();
	let hasLastRun = false;
	let lastRunSource: PixelImage | null = null;
	let lastRunValuesJson = "";
	let pipetteTargetId = $state<string | null>(null);

	function handlePipetteToggle(id: string) {
		pipetteTargetId = pipetteTargetId === id ? null : id;
	}

	function handlePickColor(hex: string) {
		if (!pipetteTargetId) return;
		values[pipetteTargetId] = hex;
		pipetteTargetId = null;
	}

	async function handleFile(file: File) {
		errorText = "";
		status = "processing";
		try {
			source = await decodeFile(file);
			values = defaultParams(tool);
			result = null;
			previewResult = null;
			showMask = false;
			pipetteTargetId = null;
			info = isInfo ? imageInfo(source) : null;
			if (isInfo) {
				status = "loaded";
			} else {
				await runTool();
			}
		} catch (e) {
			showError(e);
		}
	}

	async function handleTextSubmit(text: string) {
		if (!isTextSource) return;
		errorText = "";
		status = "processing";
		if (tool.textToText) {
			try {
				result = null;
				previewResult = null;
				info = null;
				textResult = await tool.textToText(text);
				status = "loaded";
			} catch (e) {
				showError(e);
			}
			return;
		}
		if (!tool.runFromText) return;
		try {
			source = await tool.runFromText(text, defaultParams(tool));
			values = defaultParams(tool);
			result = null;
			textResult = null;
			previewResult = null;
			showMask = false;
			pipetteTargetId = null;
			info = null;
			await runTool();
		} catch (e) {
			showError(e);
		}
	}

	async function runTool() {
		if (isInfo) return;
		if (!source && !isSourceless) return;
		const token = runner.next();
		hasLastRun = true;
		lastRunSource = source;
		lastRunValuesJson = JSON.stringify(sanitized);
		lastRunChainJson = JSON.stringify(chain);
		try {
			let next: PixelImage | null = null;
			let nextText: string | null = null;

			if (tool.resultType === "text") {
				nextText = await tool.toText!(source!, sanitized);
			} else if (isSourceless) {
				next = await tool.generate!(sanitized);
			} else {
				next = await executeStep(tool, source!, sanitized);
			}
			let nextPreview: PixelImage | null = null;
			if (tool.preview && source) {
				try {
					nextPreview = await tool.preview(source, sanitized);
				} catch {
					nextPreview = null;
				}
			}

			if (!runner.isCurrent(token)) return;
			result = next;
			previewResult = nextPreview;
			textResult = nextText;

			const collected: (PixelImage | null)[] = [];
			let current: PixelImage | null = next ?? source;
			for (let i = 0; i < chain.length; i++) {
				const step = chain[i];
				const stepTool = step.toolId === "" ? undefined : getTool(step.toolId);
				if (!current || !stepTool?.run) {
					collected.push(null);
					continue;
				}
				try {
					current = await executeStep(
						stepTool,
						current,
						sanitizeParams(stepTool, step.values),
					);
				} catch (e) {
					throw new Error(
						t("toolPage.stepError", {
							n: i + 2,
							title: toolTitle(stepTool),
							msg: errorMessage(e),
						}),
					);
				}
				if (!runner.isCurrent(token)) return;
				collected.push(current);
			}
			chainResults = collected;
			status = "loaded";
		} catch (e) {
			if (!runner.isCurrent(token)) return;
			showError(e);
		}
	}

	$effect(() => {
		const valuesJson = JSON.stringify(sanitized);
		const chainJson = JSON.stringify(chain);
		if (
			hasLastRun &&
			source === lastRunSource &&
			valuesJson === lastRunValuesJson &&
			chainJson === lastRunChainJson
		) {
			return;
		}
		if (!source && !isSourceless) return;
		if (isInfo) return;
		return runner.schedule(() => void runTool());
	});

	$effect(() => {
		if (isPreset) return;
		const filled = chain.filter((step) => step.toolId !== "");
		if (filled.length === 0 && !hasLastRun) return;
		saveSteps(filled);
	});

	function errorMessage(e: unknown): string {
		if (e instanceof ToolError) return t(e.key, e.vars);
		return t(e instanceof Error ? e.message : String(e));
	}

	function showError(e: unknown) {
		status = source ? "loaded" : "idle";
		errorText = errorMessage(e);
	}

	function reset() {
		source = null;
		result = null;
		previewResult = null;
		textResult = null;
		showMask = false;
		pipetteTargetId = null;
		info = null;
		errorText = "";
		status = "idle";
		clearOverlay();
		values = { ...defaultParams(tool), ...presetBaseValues };
	}

	async function handleOverlayFile(file: File) {
		try {
			setOverlay(await decodeFile(file));
		} catch (e) {
			errorText = errorMessage(e);
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (!item.type.startsWith("image/")) continue;
			const file = item.getAsFile();
			if (file) {
				event.preventDefault();
				if (!isSupportedImage(file)) {
					errorText = errorMessage(unsupportedImageError(file));
					return;
				}
				handleFile(file);
			}
			return;
		}
	}
</script>

<svelte:window onpaste={handlePaste} />

<section>
	<h1>{toolTitle(tool)}</h1>
	<p class="description text-muted">{toolDescription(tool)}</p>

	{#if errorText}
		<div class="error-banner" role="alert">{errorText}</div>
	{/if}

	<StageComponent
		mode="base"
		{tool}
		{source}
		{result}
		displayImage={shownBase}
		{info}
		{status}
		{isInfo}
		{isSourceless}
		{isTextSource}
		{textResult}
		{sanitized}
		{canChainBase}
		hasChain={chain.length > 0}
		{hasMask}
		bind:showMask
		bind:values
		{pipetteTargetId}
		{handleFile}
		onTextSubmit={handleTextSubmit}
		onSourceError={(e) => (errorText = errorMessage(e))}
		{reset}
		{toggleChain}
		{handlePipetteToggle}
		{handlePickColor}
		{showError}
		{errorMessage}
		{overlayImage}
		onOverlayFile={(f) => void handleOverlayFile(f)}
		onOverlayError={(e) => (errorText = errorMessage(e))}
		onOverlayClear={clearOverlay}
	/>

	<div class="chain-stack">
		{#each chain as step, index (step.id)}
			{#if step.toolId === ""}
				<div class="panel empty-slot">
					<header>
						<h3 class="heading-section">
							{t("toolPage.stepHeading", { n: index + 2 })}
						</h3>
						<button
							type="button"
							class="remove-step"
							aria-label={t("toolPage.removeStepAria")}
							onclick={() => removeChainStep(index)}
						>
							✕
						</button>
					</header>
					<ToolSearch
						onSelect={(id) => applyChainTool(index, id)}
						chainableOnly
					/>
				</div>
			{:else if getTool(step.toolId)}
				{@const stepTool = getTool(step.toolId)!}
				{#if stageVariant === "inline"}
					{@const StepIcon = TOOL_ICONS[stepTool.id]}
					<ToolStage
						mode="chain"
						{index}
						tool={stepTool}
						bind:values={step.values}
						input={index === 0 ? result : (chainResults[index - 1] ?? null)}
						result={chainResults[index] ?? null}
						busy={status === "processing"}
						isLast={index === chain.length - 1}
						onRemove={() => removeChainStep(index)}
						onError={showError}
						onAddStep={addChainStep}
						onRemoveChain={removeChain}
					>
						{#snippet header()}
							<span class="edge-legend step-legend">
								{#if StepIcon}
									<span class="step-icon" aria-hidden="true">
										<StepIcon size={14} strokeWidth={2} />
									</span>
								{/if}
								{t("chain.stepLabel", {
									n: index + 2,
									title: toolTitle(stepTool),
								})}
								<button
									type="button"
									class="remove-step"
									aria-label={t("toolPage.removeStepAria")}
									title={t("toolPage.removeStepAria")}
									onclick={() => removeChainStep(index)}
								>
									✕
								</button>
							</span>
						{/snippet}
					</ToolStage>
				{:else}
					<ChainToolBlock
						{index}
						tool={stepTool}
						bind:values={step.values}
						input={index === 0 ? result : (chainResults[index - 1] ?? null)}
						result={chainResults[index] ?? null}
						busy={status === "processing"}
						isLast={index === chain.length - 1}
						onRemove={() => removeChainStep(index)}
						onError={showError}
						onAddStep={addChainStep}
						onRemoveChain={removeChain}
					/>
				{/if}
			{/if}
		{/each}
	</div>
</section>

<style>
	h1 {
		margin-bottom: var(--space-1);
	}

	.description {
		max-width: 48rem;
		margin-bottom: var(--space-4);
	}

	.error-banner {
		margin-bottom: var(--space-3);
	}

	.step-legend {
		left: var(--space-3);
		top: -0.75em;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text);
		font-weight: 600;
		z-index: 2;
	}

	.step-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: var(--radius-s);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
		color: var(--link);
	}

	.empty-slot {
		padding: var(--space-3);
	}

	.empty-slot header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.empty-slot h3 {
		margin: 0;
	}

	.remove-step {
		width: 1.6rem;
		height: 1.6rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		color: var(--text-muted);
		line-height: 1;
		cursor: pointer;
	}

	.remove-step:hover {
		border-color: var(--danger);
		color: var(--danger);
	}
</style>
