<script lang="ts">
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { InputMode } from "$lib/registry";
	import PreviewTile from "./layout/PreviewTile.svelte";
	import SchemaTextSource from "./SchemaTextSource.svelte";

	interface Props {
		mode: InputMode;
		source: PixelImage | null;
		textSource?: string;
		running?: boolean;
		ontextinput?: (text: string) => void;
		onrendertext?: () => void;
	}
	let {
		mode,
		source,
		textSource = "",
		running = false,
		ontextinput,
		onrendertext,
	}: Props = $props();

	const sourceUrl = $derived(source ? toDataUrl(source) : null);
</script>

<PreviewTile label={t("sourceCard.source")} viewMode={mode}>
	{#if mode === "text"}
		<div class="text-source-wrap">
			<SchemaTextSource
				value={textSource}
				disabled={running}
				oninput={ontextinput ?? (() => {})}
				onrender={onrendertext ?? (() => {})}
			/>
		</div>
	{:else if mode === "image" && sourceUrl}
		<img src={sourceUrl} alt={t("sourceCard.alt")} />
	{:else if mode === "image"}
		<span class="empty">{t("sourceCard.chooseImage")}</span>
	{:else}
		<span class="empty">{t("sourceCard.noSource")}</span>
	{/if}
</PreviewTile>

<style>
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	.text-source-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}
</style>
