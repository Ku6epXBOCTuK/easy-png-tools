<script lang="ts">
	import MetaList from "$lib/components/MetaList.svelte";
	import SchemaActions from "$lib/components/SchemaActions.svelte";
	import SchemaResultTile from "$lib/components/SchemaResultTile.svelte";
	import SchemaSourceTile from "$lib/components/SchemaSourceTile.svelte";
	import type { PixelImage } from "$lib/core/types";
	import type { FileResult, InputMode, ResultKind } from "$lib/registry";

	interface Props {
		inputMode: InputMode;
		resultKind?: ResultKind;
		source: PixelImage | null;
		result: PixelImage | null;
		fileResult?: FileResult | null;
		textSource?: string;
		textResult?: string | null;
		running?: boolean;
		error?: string;
		onupload: (file: File) => void;
		ongenerate?: () => void;
		ontextsource?: (text: string) => void;
		onrendertext?: () => void;
		oncopytext?: () => void;
		ondownloadtxt?: () => void;
		ondownload: () => void;
	}
	let {
		inputMode,
		resultKind = "image",
		source,
		result,
		fileResult = null,
		textSource = "",
		textResult = null,
		running = false,
		error = "",
		onupload,
		ongenerate,
		ontextsource,
		onrendertext,
		oncopytext,
		ondownloadtxt,
		ondownload,
	}: Props = $props();

	const isGenerator = $derived(inputMode === "none");
	const sourceValue = $derived(
		isGenerator
			? "—"
			: inputMode === "text"
				? "text"
				: source
					? `${source.width} × ${source.height} px`
					: "—",
	);
	const resultValue = $derived(
		resultKind === "image"
			? result
				? `${result.width} × ${result.height} px`
				: "—"
			: resultKind === "files"
				? fileResult
					? `${fileResult.files.length} parts`
					: "—"
				: textResult
					? "text"
					: "—",
	);
	const formatValue = $derived(resultKind === "files" ? "ZIP (PNG)" : "PNG");
	const hasResult = $derived(
		resultKind === "image"
			? Boolean(result)
			: resultKind === "files"
				? Boolean(fileResult)
				: Boolean(textResult),
	);
</script>

<div class="panel-head">
	<span class="label"
		>{isGenerator ? "GENERATOR / RESULT" : "SOURCE / RESULT"}</span
	>
	<SchemaActions
		{inputMode}
		canDownload={hasResult}
		{running}
		{onupload}
		ongenerate={ongenerate ?? (() => {})}
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
		{running}
		oncopy={oncopytext}
		{ondownloadtxt}
	/>
</div>

<div class="meta">
	<MetaList
		items={[
			{ caption: "SOURCE", value: sourceValue },
			{ caption: "RESULT", value: resultValue },
			{ caption: "FORMAT", value: formatValue },
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
