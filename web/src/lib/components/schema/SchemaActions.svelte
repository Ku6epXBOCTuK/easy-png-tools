<script lang="ts">
	import DownloadButton from "$lib/components/ui/DownloadButton.svelte";
	import UploadButton from "$lib/components/ui/UploadButton.svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		inputMode: "image" | "text" | "none";
		canDownload: boolean;
		running: boolean;
		onupload: (file: File) => void;
		ondownload: () => void;
	}
	let { inputMode, canDownload, running, onupload, ondownload }: Props =
		$props();
</script>

<div class="actions">
	{#if inputMode === "image"}
		<UploadButton label={t("actions.openImage")} onfile={onupload} />
	{/if}
	{#if canDownload}
		<DownloadButton
			label={t("actions.downloadResult")}
			onclick={ondownload}
			disabled={running}
		/>
	{/if}
</div>

<style>
	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-l);
		flex-wrap: wrap;
	}
</style>
