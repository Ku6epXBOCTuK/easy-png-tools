<script lang="ts">
	import DownloadButton from "$lib/components/ui/DownloadButton.svelte";
	import UploadButton from "$lib/components/ui/UploadButton.svelte";
	import type { OutputMime } from "$lib/core/io";
	import { outputFormatByMime } from "$lib/core/io";
	import { t } from "$lib/i18n/t";
	import type { ResultKind } from "$lib/registry";
	import SchemaDownload from "./SchemaDownload.svelte";

	interface Props {
		inputMode: "image" | "text" | "none";
		resultKind?: ResultKind;
		canDownload: boolean;
		running: boolean;
		format?: OutputMime;
		quality?: number;
		alphaLoss?: boolean;
		onupload: (file: File) => void;
		ondownload: () => void;
		onformat?: (mime: OutputMime) => void;
		onquality?: (value: number) => void;
	}
	let {
		inputMode,
		resultKind = "image",
		canDownload,
		running,
		format = "image/png",
		quality = undefined,
		alphaLoss = false,
		onupload,
		ondownload,
		onformat,
		onquality,
	}: Props = $props();
</script>

<div class="actions">
	{#if inputMode === "image"}
		<UploadButton label={t("actions.openImage")} onfile={onupload} />
	{/if}
	{#if canDownload && resultKind === "image"}
		<SchemaDownload
			{format}
			{quality}
			{running}
			{ondownload}
			onformat={(v) => onformat?.(v)}
			onquality={(v) => onquality?.(v)}
		/>
	{:else if canDownload && resultKind === "files"}
		<DownloadButton
			label={t("actions.downloadFormat", { format: "ZIP" })}
			onclick={ondownload}
			disabled={running}
		/>
	{/if}
</div>
{#if canDownload && alphaLoss}
	<p class="alpha-warning" role="status">
		{t("actions.alphaLoss", { format: outputFormatByMime(format).label })}
	</p>
{/if}

<style>
	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-l);
		flex-wrap: wrap;
	}
	.alpha-warning {
		margin: var(--space-m) 0 0;
		color: var(--color-warning);
		font: var(--font-size-s) var(--font-mono);
	}
</style>
