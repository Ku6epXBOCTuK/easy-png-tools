<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { ToolError } from '$lib/core/errors';
	import { decodeFile, isSupportedImage, unsupportedImageError } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import { defaultParams, getTool, outputOf, sanitizeParams, type ToolEntry } from '$lib/registry';
	import { loadStoredSteps, newStepId, saveSteps, type PipelineStep } from '$lib/tools/pipeline';
	import DownloadButton from './DownloadButton.svelte';
	import ParamForm from './ParamForm.svelte';
	import Preview from './Preview.svelte';
	import ToolSearch from './search/ToolSearch.svelte';
	import ChainToolBlock from './chain/ChainToolBlock.svelte';
	import { createAutoRunner } from '$lib/tools/auto-run';
	import { executeStep } from '$lib/tools/executor';
	import { t } from '$lib/i18n/t';
	import { toolDescription, toolTitle } from '$lib/i18n/tool-strings';
	import type { StageStatus } from './stage/stage-props';
	import ToolStageInline from './stage/ToolStageInline.svelte';

	let { tool, restoreChain = false }: { tool: ToolEntry; restoreChain?: boolean } = $props();

	type Status = StageStatus;

	let status = $state<Status>('idle');
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let previewResult = $state<PixelImage | null>(null);
	let textResult = $state<string | null>(null);
	let showMask = $state(false);
	let info = $state<ImageInfo | null>(null);
	let errorText = $state('');
	let values = $state<Record<string, any>>({});
	// svelte-ignore state_referenced_locally
	let chain = $state<PipelineStep[]>(restoreChain ? loadStoredSteps() : []);
	let chainResults = $state<(PixelImage | null)[]>([]);
	let lastRunChainJson = '';

	const isInfo = $derived(tool.resultType === 'info');
	const isSourceless = $derived(tool.sourceMode === 'none');
	const isTextSource = $derived(tool.sourceMode === 'text');
	const sanitized = $derived(sanitizeParams(tool, values));
	const canChainBase = $derived(
		(tool.resultType ?? 'image') === 'image' && tool.sourceMode !== 'text'
	);
	const hasMask = $derived(typeof tool.preview === 'function');
	const shownBase = $derived(showMask && previewResult ? previewResult : result);
	const hasFilledSteps = $derived(chain.some((step) => step.toolId !== ''));

	function addChainStep() {
		chain.push({ id: newStepId(), toolId: '', values: {} });
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
	let lastRunValuesJson = '';
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
		errorText = '';
		status = 'processing';
		try {
			source = await decodeFile(file);
			values = defaultParams(tool);
			result = null;
			previewResult = null;
			showMask = false;
			pipetteTargetId = null;
			info = isInfo ? imageInfo(source) : null;
			if (isInfo) {
				status = 'loaded';
			} else {
				await runTool();
			}
		} catch (e) {
			showError(e);
		}
	}

	async function handleTextSubmit(text: string) {
		if (!isTextSource || !tool.runFromText) return;
		errorText = '';
		status = 'processing';
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

			if (tool.resultType === 'text') {
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
				const stepTool = step.toolId === '' ? undefined : getTool(step.toolId);
				if (!current || !stepTool?.run) {
					collected.push(null);
					continue;
				}
				try {
					current = await executeStep(stepTool, current, sanitizeParams(stepTool, step.values));
				} catch (e) {
					throw new Error(
						t('toolPage.stepError', { n: i + 1, title: toolTitle(stepTool), msg: errorMessage(e) })
					);
				}
				if (!runner.isCurrent(token)) return;
				collected.push(current);
			}
			chainResults = collected;
			status = 'loaded';
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
		const filled = chain.filter((step) => step.toolId !== '');
		if (filled.length === 0 && !hasLastRun) return;
		saveSteps(filled);
	});

	function errorMessage(e: unknown): string {
		if (e instanceof ToolError) return t(e.key, e.vars);
		return t(e instanceof Error ? e.message : String(e));
	}

	function showError(e: unknown) {
		status = source ? 'loaded' : 'idle';
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
		errorText = '';
		status = 'idle';
		values = defaultParams(tool);
	}

	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (!item.type.startsWith('image/')) continue;
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

	<ToolStageInline
		tool={tool}
		source={source}
		result={result}
		displayImage={shownBase}
		info={info}
		status={status}
		isInfo={isInfo}
		isSourceless={isSourceless}
		isTextSource={isTextSource}
		textResult={textResult}
		sanitized={sanitized}
		canChainBase={canChainBase}
		hasChain={chain.length > 0}
		hasMask={hasMask}
		bind:showMask
		bind:values
		pipetteTargetId={pipetteTargetId}
		handleFile={handleFile}
		onTextSubmit={handleTextSubmit}
		onSourceError={(e) => (errorText = errorMessage(e))}
		reset={reset}
		toggleChain={toggleChain}
		handlePipetteToggle={handlePipetteToggle}
		handlePickColor={handlePickColor}
		showError={showError}
		errorMessage={errorMessage}
	/>

	<div class="chain-stack">
		{#each chain as step, index (step.id)}
			{#if step.toolId === ''}
				<div class="panel empty-slot">
				<header>
					<h3 class="heading-section">{t('toolPage.stepHeading', { n: index + 1 })}</h3>
					<button
						type="button"
						class="remove-step"
						aria-label={t('toolPage.removeStepAria')}
						onclick={() => removeChainStep(index)}
					>
						✕
					</button>
				</header>
					<ToolSearch onSelect={(id) => applyChainTool(index, id)} />
				</div>
			{:else if getTool(step.toolId)}
				{@const stepTool = getTool(step.toolId)!}
				<ChainToolBlock
					index={index}
					tool={stepTool}
					bind:values={step.values}
					input={index === 0 ? result : (chainResults[index - 1] ?? null)}
					result={chainResults[index] ?? null}
					busy={status === 'processing'}
					isLast={index === chain.length - 1}
					onRemove={() => removeChainStep(index)}
					onError={showError}
					onAddStep={addChainStep}
					onRemoveChain={removeChain}
				/>
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
