<script lang="ts">
	import { t } from '$lib/i18n/t';
	import ParamsCard from '../tool/ParamsCard.svelte';
	import ResultCard from '../tool/ResultCard.svelte';
	import SourceCard from '../tool/SourceCard.svelte';
	import TextInputCard from '../tool/TextInputCard.svelte';
	import type { StageProps } from './stage-props';

	let {
		tool,
		source,
		result,
		displayImage,
		info,
		status,
		isInfo,
		isSourceless,
		isTextSource,
		textResult,
		sanitized,
		canChainBase,
		hasChain,
		hasMask,
		showMask = $bindable(false),
		values = $bindable(),
		pipetteTargetId,
		handleFile,
		onTextSubmit,
		onSourceError,
		reset,
		toggleChain,
		handlePipetteToggle,
		handlePickColor,
		showError
	}: StageProps = $props();

	const showParams = $derived(
		(source !== null || isSourceless) && !isInfo && (tool.params.length > 0 || hasMask)
	);
</script>

<div
	class="panel stage-inline"
	class:no-source={isSourceless}
	class:no-params={!showParams}
>
	{#if !isSourceless}
		<section class="pane">
			<span class="edge-legend pane-legend" aria-hidden="true">{t('toolPage.legendSource')}</span>
			<div class="pane-body">
				{#if isTextSource && !source}
					<TextInputCard onSubmit={onTextSubmit} />
				{:else}
					<SourceCard
						{source}
						onFile={handleFile}
						onError={onSourceError}
						onReset={reset}
						pipetteActive={!!pipetteTargetId}
						onPickColor={handlePickColor}
					/>
				{/if}
			</div>
		</section>
	{/if}

	{#if showParams}
		<section class="pane pane-params">
			<span class="edge-legend pane-legend" aria-hidden="true">{t('toolPage.legendParams')}</span>
			<div class="pane-body">
				<ParamsCard
					{tool}
					params={tool.params}
					bind:values
					{pipetteTargetId}
					onPipetteToggle={handlePipetteToggle}
					{hasMask}
					bind:showMask
				/>
			</div>
		</section>
	{/if}

	<section class="pane">
		<span class="edge-legend pane-legend" aria-hidden="true">
			{isInfo ? t('toolPage.legendSummary') : t('toolPage.legendResult')}
		</span>
		<div class="pane-body">
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
				onDownloadError={showError}
			/>
		</div>
	</section>
</div>

<style>
	.stage-inline {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-4);
	}

	.pane {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.pane + .pane {
		border-top: 1px solid var(--border);
		padding-top: var(--space-4);
	}

	.pane-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-height: 14rem;
	}

	.pane-params .pane-body {
		align-items: stretch;
	}

		.pane-params :global(.root) {
			padding: 0;
			height: 100%;
		}

		/* Вертикальные поля в узкой колонке: название сверху, контрол ниже */
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

	@media (min-width: 75rem) {
		.stage-inline:not(.no-params):not(.no-source) {
			grid-template-columns: minmax(0, 1fr) clamp(13rem, 17vw, 18rem) minmax(0, 1fr);
		}

		.stage-inline.no-params {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}

		.stage-inline.no-source {
			grid-template-columns: clamp(13rem, 17vw, 18rem) minmax(0, 1fr);
		}

		.pane + .pane {
			border-top: none;
			padding-top: 0;
			border-left: 1px solid var(--border);
			padding-left: var(--space-4);
		}

		.pane-params :global(.params-grid) {
			grid-template-columns: 1fr;
		}
	}
</style>
