<script lang="ts">
	import { hasPreviewResult } from "./schema-preview-model";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import type { OutputMime } from "$lib/core/io";
	import { t } from "$lib/i18n/t";
	import type {
		FileResult,
		InputMode,
		ResultKind,
		ResultNote,
	} from "$lib/registry";

	interface Props {
		inputMode: InputMode;
		resultKind?: ResultKind;
		toolId: string;
		source: PixelImage | null;
		result: PixelImage | null;
		resultNote?: ResultNote | null;
		fileResult?: FileResult | null;
		textSource?: string;
		textResult?: string | null;
		textVars?: Record<string, string | number>;
		running?: boolean;
		error?: string;
		stepResults?: (PixelImage | null)[];
		aligned?: boolean;
		ontogglealign?: () => void;
		format?: OutputMime;
		quality?: number;
		alphaLoss?: boolean;
		onupload: (file: File) => void;
		ontextsource?: (text: string) => void;
		onrendertext?: () => void;
		oncopytext?: () => void;
		ondownloadtxt?: () => void;
		ondownload: () => void;
		onformat?: (mime: OutputMime) => void;
		onquality?: (value: number) => void;
	}
	let {
		inputMode,
		resultKind = "image",
		toolId,
		source,
		result,
		resultNote = null,
		fileResult = null,
		textSource = "",
		textResult = null,
		textVars = undefined,
		running = false,
		error = "",
		stepResults = [],
		aligned = false,
		ontogglealign,
		format = "image/png",
		quality = undefined,
		alphaLoss = false,
		onupload,
		ontextsource,
		onrendertext,
		oncopytext,
		ondownloadtxt,
		ondownload,
		onformat,
		onquality,
	}: Props = $props();

	const hasResult = $derived(
		hasPreviewResult({ inputMode, resultKind, result, fileResult, textResult }),
	);
</script>

<div class="panel-head">
	<span class="label">{t("resultCard.previewPanel")}</span>
	{#if stepResults.length > 1}
		<label class="align-toggle">
			<Toggle
				checked={aligned}
				label={t("chain.alignToggle")}
				onchange={() => ontogglealign?.()}
			/>
			<span>{t("chain.alignToggle")}</span>
		</label>
	{/if}
	<SchemaActions
		{inputMode}
		{resultKind}
		canDownload={hasResult}
		{running}
		{format}
		{quality}
		{alphaLoss}
		{onupload}
		{ondownload}
		{onformat}
		{onquality}
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
		{onupload}
	/>
	{#each stepResults.slice(0, -1) as img, i (i)}
		{#if img}
			<PreviewTile
				label={t("chain.stepResult", { n: i + 1 })}
				viewMode="image"
				dims={`${img.width} × ${img.height}`}
			>
				<img src={toDataUrl(img)} alt="" />
			</PreviewTile>
		{/if}
	{/each}
	<SchemaResultTile
		{resultKind}
		{result}
		{resultNote}
		{fileResult}
		{textResult}
		{textVars}
		{toolId}
		{running}
		oncopy={oncopytext}
		{ondownloadtxt}
	/>
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
