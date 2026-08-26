<script lang="ts">
	import type { Snippet } from 'svelte';
	import { outputOf, sanitizeParams, type ToolEntry } from '$lib/registry';
	import type { ImageInfo } from '$lib/core/analyze';
	import type { PixelImage } from '$lib/core/types';
	import { t } from '$lib/i18n/t';
	import { toolTitle } from '$lib/i18n/tool-strings';
	import { TOOL_ICONS } from '$lib/tools/tool-icons';
	import DownloadButton from '../DownloadButton.svelte';
	import Button from '../ui/Button.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import OverlayCard from '../tool/OverlayCard.svelte';
	import ParamsCard from '../tool/ParamsCard.svelte';
	import ResultCard from '../tool/ResultCard.svelte';
	import SourceCard from '../tool/SourceCard.svelte';
	import TextInputCard from '../tool/TextInputCard.svelte';
	import Preview from '../Preview.svelte';
	import type { StageStatus } from './stage-props';

	interface Props {
		mode: 'base' | 'chain';
		header?: Snippet;
		tool: ToolEntry;
		source?: PixelImage | null;
		displayImage?: PixelImage | null;
		info?: ImageInfo | null;
		status?: StageStatus;
		isInfo?: boolean;
		isSourceless?: boolean;
		isTextSource?: boolean;
		textResult?: string | null;
		sanitized?: Record<string, any>;
		canChainBase?: boolean;
		hasChain?: boolean;
		hasMask?: boolean;
		pipetteTargetId?: string | null;
		values: Record<string, any>;
		showMask?: boolean;
		handleFile?: (file: File) => Promise<void> | void;
		onTextSubmit?: (text: string) => Promise<void> | void;
		onSourceError?: (e: unknown) => void;
		reset?: () => void;
		toggleChain?: () => void;
		handlePipetteToggle?: (id: string) => void;
		handlePickColor?: (hex: string) => void;
		showError?: (e: unknown) => void;
		overlayImage?: PixelImage | null;
		onOverlayFile?: (file: File) => void;
		onOverlayError?: (e: unknown) => void;
		onOverlayClear?: () => void;
		index?: number;
		input?: PixelImage | null;
		result?: PixelImage | null;
		busy?: boolean;
		isLast?: boolean;
		onRemove?: () => void;
		onError?: (e: unknown) => void;
		onAddStep?: () => void;
		onRemoveChain?: () => void;
	}

	let {
		mode,
		header,
		tool,
		source = null,
		displayImage = null,
		info = null,
		status = 'idle',
		isInfo = false,
		isSourceless = false,
		isTextSource = false,
		textResult = null,
		sanitized = {},
		canChainBase = false,
		hasChain = false,
		hasMask = false,
		pipetteTargetId = null,
		values = $bindable({}),
		showMask = $bindable(false),
		handleFile,
		onTextSubmit,
		onSourceError,
		reset,
		toggleChain,
		handlePipetteToggle,
		handlePickColor,
		showError,
		overlayImage = null,
		onOverlayFile,
		onOverlayError,
		onOverlayClear,
		index = 0,
		input = null,
		result = null,
		busy = false,
		isLast = false,
		onRemove,
		onError,
		onAddStep,
		onRemoveChain
	}: Props = $props();

	const isChain = $derived(mode === 'chain');
	const format = $derived(outputOf(tool));
	const safeParams = $derived(sanitizeParams(tool, values ?? {}));
	const StepIcon = $derived(TOOL_ICONS[tool.id]);
	const showParams = $derived(
		mode === 'chain'
			? tool.params.length > 0
			: (source !== null || isSourceless) &&
				!isInfo &&
				(tool.params.length > 0 || hasMask)
	);

	const leftLegend = $derived(isChain ? t('chain.inputLegend') : t('toolPage.legendSource'));
	const midLegend = $derived(isChain ? t('chain.paramsLegend') : t('toolPage.legendParams'));
	const rightLegend = $derived(
		isChain ? t('chain.resultLegend') : isInfo ? t('toolPage.legendSummary') : t('toolPage.legendResult')
	);
</script>

<div class="panel stage-grid" class:no-params={!showParams} class:single={!isChain && !!isSourceless}>
	{#if header}
		{@render header()}
	{/if}

	{#if isChain}
		<section class="pane">
			<span class="edge-legend pane-legend" aria-hidden="true">{leftLegend}</span>
			<div class="pane-body">
				<Preview image={input} />
			</div>
		</section>
	{:else if !isSourceless}
		<section class="pane">
			<span class="edge-legend pane-legend" aria-hidden="true">{leftLegend}</span>
			<div class="pane-body">
				{#if isTextSource && !source}
					<TextInputCard onSubmit={(text) => onTextSubmit?.(text)} />
				{:else}
					<SourceCard
						{source}
						onFile={(f) => handleFile?.(f)}
						onError={(e) => onSourceError?.(e)}
						onReset={() => reset?.()}
						pipetteActive={!!pipetteTargetId}
						onPickColor={(hex) => handlePickColor?.(hex)}
					/>
					{#if tool.needsOverlaySource && source}
						<OverlayCard
							overlay={overlayImage}
							onFile={(f) => onOverlayFile?.(f)}
							onError={(e) => onOverlayError?.(e)}
							onClear={() => onOverlayClear?.()}
						/>
					{/if}
				{/if}
			</div>
		</section>
	{/if}

	{#if showParams}
		<section class="pane pane-params">
			<span class="edge-legend pane-legend" aria-hidden="true">{midLegend}</span>
			<div class="pane-body">
				<ParamsCard {tool} params={tool.params} bind:values {pipetteTargetId} onPipetteToggle={(id) => handlePipetteToggle?.(id)} {hasMask} bind:showMask />
			</div>
		</section>
	{/if}

	<section class="pane">
		<span class="edge-legend pane-legend" aria-hidden="true">{rightLegend}</span>
		<div class="pane-body">
			{#if isChain}
				{#if busy && !result}
					<EmptyState title={t('chain.busyTitle')} hint={t('chain.busyHint')} />
				{:else}
					<Preview image={result} />
					{#if busy}
						<span class="recalc" aria-live="polite">{t('resultCard.recalc')}</span>
					{/if}
					<div class="actions-row">
						<DownloadButton
							image={result}
							format={format}
							baseName="{index + 2}-{tool.id}"
							params={safeParams}
							onError={(e) => showError?.(e)}
						/>
						<Button variant="secondary" fullWidth onclick={isLast ? onAddStep : onRemoveChain}>
							{isLast ? t('resultCard.nextTool') : t('resultCard.breakChain')}
						</Button>
					</div>
				{/if}
			{:else}
				<ResultCard
					{tool}
					sourceLoaded={isSourceless ? true : !!source}
					{status}
					{result}
					displayImage={displayImage}
					{info}
					{isInfo}
					params={sanitized}
					textResult={textResult}
					onChainToggle={canChainBase ? toggleChain : undefined}
					{hasChain}
					onDownloadError={(e) => showError?.(e)}
				/>
			{/if}
		</div>
	</section>
</div>

<style>
	.stage-grid {
		position: relative;
		display: grid;
		gap: var(--space-4);
		padding: var(--space-4);
	}

	.pane {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 14rem;
	}

	.pane-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		width: 100%;
	}

	.pane + .pane {
		border-top: 1px solid var(--border);
		padding-top: var(--space-4);
	}

	/* Параметры в узкой колонке: вертикальные поля с переносами.
	   :global под локальным якорем даёт специфичность выше scoped-правил полей. */
	.pane-params :global(.root) {
		padding: 0;
		height: 100%;
	}

	.pane-params :global(.params-grid) {
		grid-template-columns: 1fr;
	}

	.pane-params :global(.field) {
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-1);
	}

	.pane-params :global(.field > label) {
		max-width: none;
	}

	.pane-params :global(.control-slot),
	.pane-params :global(.row) {
		align-items: stretch;
		max-width: none;
		width: 100%;
		flex-wrap: wrap;
		row-gap: var(--space-1);
	}

	.pane-params :global(.hint) {
		align-self: auto;
		text-align: left;
	}

	.pane-params :global(input[type='range']) {
		order: -1;
		flex: 1 1 100%;
		min-width: 0;
		width: 100%;
	}

	.pane-params :global(.row > output) {
		margin-left: auto;
	}

	.pane-params :global(input.control),
	.pane-params :global(select.control) {
		max-width: none;
		width: 100%;
	}

	.recalc {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		padding: 2px var(--space-2);
		border-radius: var(--radius-s);
		background: color-mix(in srgb, var(--accent) 12%, var(--surface));
		color: var(--link);
		font-size: var(--text-xs);
	}

	@media (min-width: 75rem) {
		.stage-grid:not(.no-params):not(.single) {
			grid-template-columns: minmax(0, 1fr) clamp(13rem, 17vw, 18rem) minmax(0, 1fr);
		}

		.stage-grid.no-params:not(.single),
		.stage-grid.single.no-params {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}

		.stage-grid.single:not(.no-params) {
			grid-template-columns: clamp(13rem, 17vw, 18rem) minmax(0, 1fr);
		}

		.pane + .pane {
			border-top: none;
			padding-top: 0;
			border-left: 1px solid var(--border);
			padding-left: var(--space-4);
		}
	}
</style>
