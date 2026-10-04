<script lang="ts">
	import MetaList from "$lib/components/display/MetaList.svelte";
	import { buildSchemaPreviewModel } from "./schema-preview-model";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { FileResult, InputMode, ResultKind } from "$lib/registry";

	interface Props {
		inputMode: InputMode;
		resultKind?: ResultKind;
		toolId: string;
		source: PixelImage | null;
		result: PixelImage | null;
		fileResult?: FileResult | null;
		textSource?: string;
		textResult?: string | null;
		textVars?: Record<string, string | number>;
		running?: boolean;
		error?: string;
		onupload: (file: File) => void;
		ontextsource?: (text: string) => void;
		onrendertext?: () => void;
		oncopytext?: () => void;
		ondownloadtxt?: () => void;
		ondownload: () => void;
	}
	let {
		inputMode,
		resultKind = "image",
		toolId,
		source,
		result,
		fileResult = null,
		textSource = "",
		textResult = null,
		textVars = undefined,
		running = false,
		error = "",
		onupload,
		ontextsource,
		onrendertext,
		oncopytext,
		ondownloadtxt,
		ondownload,
	}: Props = $props();

	const model = $derived(
		buildSchemaPreviewModel(
			{ inputMode, resultKind, source, result, fileResult, textResult },
			t,
		),
	);
</script>

<div class="panel-head">
	<span class="label">{t("resultCard.previewPanel")}</span>
	<SchemaActions
		{inputMode}
		canDownload={model.hasResult}
		{running}
		{onupload}
		{ondownload}
	/>
</div>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<div class="pair">
	<SchemaSourceTile
		mode={inputMode}
		{source}
		{textSource}
		{running}
		ontextinput={ontextsource}
		{onrendertext}
	/>
	<SchemaResultTile
		{resultKind}
		{result}
		{fileResult}
		{textResult}
		{textVars}
		{toolId}
		{running}
		oncopy={oncopytext}
		{ondownloadtxt}
	/>
</div>

<div class="meta">
	<MetaList
		items={[
			{ caption: t("sourceCard.source"), value: model.sourceValue },
			{ caption: t("resultCard.result"), value: model.resultValue },
			{ caption: t("resultCard.format"), value: model.formatValue },
		]}
	/>
</div>

<style>
	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
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
	.meta {
		margin-top: var(--space-l);
	}
	@media (--bp-tablet) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
