<script lang="ts">
	import DownloadButton from "./ui/DownloadButton.svelte";
	import { Sparkles, Upload } from "@lucide/svelte";

	interface Props {
		inputMode: "file" | "text" | "none";
		canDownload: boolean;
		running: boolean;
		onupload: (file: File) => void;
		ongenerate: () => void;
		ondownload: () => void;
	}
	let {
		inputMode,
		canDownload,
		running,
		onupload,
		ongenerate,
		ondownload,
	}: Props = $props();
</script>

<div class="actions">
	{#if inputMode === "none"}
		<button class="btn generate" onclick={ongenerate} disabled={running}>
			<Sparkles size={14} />
			{running ? "Generating…" : "Generate"}
		</button>
	{:else if inputMode === "file"}
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
		<DownloadButton label="Download result" onclick={ondownload} />
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
	.generate {
		background: var(--color-main);
		border-color: var(--color-main);
		color: var(--color-background);
	}
	.generate:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.upload input {
		display: none;
	}
</style>
