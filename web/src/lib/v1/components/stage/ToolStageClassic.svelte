<script lang="ts">
	import { t } from "$lib/v1/i18n/t";
	import ParamsCard from "../tool/ParamsCard.svelte";
	import ResultCard from "../tool/ResultCard.svelte";
	import SourceCard from "../tool/SourceCard.svelte";
	import TextInputCard from "../tool/TextInputCard.svelte";
	import type { StageProps } from "./stage-props";

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
		showError,
		errorMessage,
	}: StageProps = $props();
</script>

<div class="panel tool-block">
	<div class="tool-stage" class:single={isSourceless}>
		{#if !isSourceless}
			<span class="edge-legend source-legend" aria-hidden="true"
				>{t("toolPage.legendSource")}</span
			>
			<div class="cell">
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
		{/if}
		<span class="edge-legend result-legend" aria-hidden="true">
			{isInfo ? t("toolPage.legendSummary") : t("toolPage.legendResult")}
		</span>
		<div class="cell">
			<ResultCard
				{tool}
				sourceLoaded={isSourceless ? true : !!source}
				{status}
				{result}
				{displayImage}
				{info}
				{isInfo}
				params={sanitized}
				{textResult}
				onChainToggle={canChainBase ? toggleChain : undefined}
				{hasChain}
				onDownloadError={showError}
			/>
		</div>
	</div>

	{#if (source || isSourceless) && !isInfo && (tool.params.length > 0 || hasMask)}
		<div class="params-sep">
			<span class="edge-legend" aria-hidden="true"
				>{t("toolPage.legendParams")}</span
			>
		</div>
		<ParamsCard
			{tool}
			params={tool.params}
			bind:values
			{pipetteTargetId}
			onPipetteToggle={handlePipetteToggle}
			{hasMask}
			bind:showMask
		/>
	{/if}
</div>

<style>
	.tool-stage {
		position: relative;
	}

	.source-legend {
		left: 25%;
		transform: translateX(-50%);
	}

	.result-legend {
		left: 75%;
		transform: translateX(-50%);
	}

	@media (max-width: 48rem) {
		.source-legend,
		.result-legend {
			display: none;
		}
	}
</style>
