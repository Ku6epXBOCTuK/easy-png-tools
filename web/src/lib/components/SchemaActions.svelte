<script lang="ts">
	import { Upload } from "@lucide/svelte";
	import { t } from "$lib/i18n/t";
	import DownloadButton from "./ui/DownloadButton.svelte";

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
		<label class="btn upload">
			<Upload size={14} />
			{t("actions.openImage")}
			<input
				type="file"
				accept="image/*"
				onchange={(e) => {
					const f = (e.target as HTMLInputElement).files?.[0];
					if (f) onupload(f);
				}}
			/>
		</label>
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
	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.upload input {
		display: none;
	}
</style>
