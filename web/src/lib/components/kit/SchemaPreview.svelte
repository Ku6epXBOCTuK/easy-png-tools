<script lang="ts">
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import SchemaActions from "$lib/components/kit/SchemaActions.svelte";
	import SchemaResultTile from "$lib/components/kit/SchemaResultTile.svelte";
	import SchemaSourceTile from "$lib/components/kit/SchemaSourceTile.svelte";
	import type { PixelImage } from "$lib/core/types";

	interface Props {
		inputMode?: "file" | "text" | "none";
		resultKind?: "image" | "text" | "verdict";
		source: PixelImage | null;
		result: PixelImage | null;
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
		inputMode = "file",
		resultKind = "image",
		source,
		result,
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
			: textResult
				? "text"
				: "—",
	);
</script>

<div class="panel-head">
	<span class="label"
		>{isGenerator ? "GENERATOR / RESULT" : "SOURCE / RESULT"}</span
	>
	<SchemaActions
		{inputMode}
		canDownload={resultKind === "image" && Boolean(result)}
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
	{#if !isGenerator}
		<SchemaSourceTile
			mode={inputMode === "text" ? "text" : "file"}
			{source}
			{textSource}
			{running}
			ontextinput={ontextsource}
			{onrendertext}
		/>
	{/if}
	<SchemaResultTile
		{resultKind}
		{result}
		{textResult}
		wide={isGenerator || resultKind !== "image"}
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
			{ caption: "FORMAT", value: "PNG" },
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
	@media (max-width: var(--bp-tablet)) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
