<script lang="ts">
	import {
		hasPreviewResult,
		type PreviewHeadModel,
		type PreviewResultModel,
		type PreviewSourceModel,
		type PreviewStepsModel,
	} from "./schema-preview-model";
	import SchemaActions from "./SchemaActions.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { InputMode, ResultKind } from "$lib/registry";

	interface Props {
		inputMode: InputMode;
		resultKind?: ResultKind;
		toolId: string;
		running?: boolean;
		error?: string;
		aligned?: boolean;
		head: PreviewHeadModel;
		source: PreviewSourceModel;
		steps?: PreviewStepsModel;
		result: PreviewResultModel;
	}
	let {
		inputMode,
		resultKind = "image",
		toolId,
		running = false,
		error = "",
		aligned = $bindable(false),
		head,
		source,
		steps = {},
		result,
	}: Props = $props();

	const stepResults = $derived(steps.results ?? []);
	const stepFileSets = $derived(steps.fileSets ?? []);
	const stepMaskable = $derived(steps.maskable ?? []);
	const stepMaskOn = $derived(steps.maskOn ?? []);
	const stepMasks = $derived(steps.masks ?? []);

	const hasResult = $derived(
		hasPreviewResult({
			inputMode,
			resultKind,
			result: result.result,
			fileResult: result.fileResult ?? null,
			textResult: result.textResult ?? null,
		}),
	);
</script>

<div class="panel-head">
	<span class="label">{t("resultCard.previewPanel")}</span>
	{#if stepResults.length > 1}
		<label class="align-toggle">
			<Toggle bind:checked={aligned} label={t("chain.alignToggle")} />
			<span>{t("chain.alignToggle")}</span>
		</label>
	{/if}
	<SchemaActions
		{inputMode}
		{resultKind}
		canDownload={hasResult}
		{running}
		{...head}
	/>
</div>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<div class="pair">
	<SchemaSourceTile
		mode={inputMode}
		{running}
		onupload={head.onupload}
		{...source}
	/>
	{#each stepResults.slice(0, -1) as img, i (i)}
		{@const set = stepFileSets[i] ?? []}
		{#if set.length > 1 && !stepMaskOn[i]}
			<PreviewTile
				label={t("chain.stepResult", { n: i + 1 })}
				viewMode="image"
				parts={set.length}
				partsDims={`${set[0].image.width} × ${set[0].image.height}`}
			>
				{#snippet actions()}
					{#if stepMaskable[i]}
						<ChipButton
							label={t("resultCard.maskToggle")}
							active={stepMaskOn[i] ?? false}
							onclick={() => steps.ontogglestepmask?.(i)}
						/>
					{/if}
				{/snippet}
				<PartsGrid files={set} />
			</PreviewTile>
		{:else if img}
			<PreviewTile
				label={t("chain.stepResult", { n: i + 1 })}
				viewMode="image"
				dims={`${img.width} × ${img.height}`}
			>
				{#snippet actions()}
					{#if stepMaskable[i]}
						<ChipButton
							label={t("resultCard.maskToggle")}
							active={stepMaskOn[i] ?? false}
							onclick={() => steps.ontogglestepmask?.(i)}
						/>
					{/if}
				{/snippet}
				<img
					src={toDataUrl(
						stepMaskOn[i] && stepMasks[i] ? (stepMasks[i] as PixelImage) : img,
					)}
					alt=""
				/>
			</PreviewTile>
		{/if}
	{/each}
	<SchemaResultTile {resultKind} {toolId} {running} {...result} />
</div>

<style>
	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-m);
		padding-bottom: var(--space-l);
		border-bottom: var(--size-border) solid var(--color-border);
		margin-bottom: var(--space-xl);
	}
	.label {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
		color: var(--color-main);
	}
	.align-toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		margin-right: auto;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.error {
		margin: 0 0 var(--space-l);
		color: var(--color-danger);
		font: var(--font-size-s) var(--font-mono);
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-l);
	}
	@media (--bp-tablet) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
