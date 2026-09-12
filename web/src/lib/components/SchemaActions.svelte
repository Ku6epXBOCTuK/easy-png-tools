<script lang="ts">
	import { Upload } from "@lucide/svelte";
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
			<Upload size={14} /> Open image
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
			label="Download result"
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
