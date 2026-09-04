<script lang="ts">
	import { Check, Upload } from "@lucide/svelte";
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import DownloadButton from "$lib/components/kit/ui/DownloadButton.svelte";

	interface Props {
		source: PixelImage | null;
		result: PixelImage | null;
		running: boolean;
		error: string;
		onupload: (file: File) => void;
		ondownload: () => void;
	}
	let { source, result, running, error, onupload, ondownload }: Props =
		$props();

	let sourceUrl = $derived(source ? toDataUrl(source) : null);
	let resultUrl = $derived(result ? toDataUrl(result) : null);
</script>

<div class="panel-head">
	<span class="label">SOURCE / RESULT</span>
	<div class="head-actions">
		<label class="upload">
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
		<DownloadButton label="Download result" onclick={ondownload} />
	</div>
</div>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<div class="pair">
	<figure class="tile">
		<figcaption><span>SOURCE</span></figcaption>
		<div class="canvas">
			{#if sourceUrl}
				<img src={sourceUrl} alt="source" />
			{:else}
				<span class="empty">choose an image</span>
			{/if}
		</div>
	</figure>
	<figure class="tile">
		<figcaption><span>RESULT {running ? "…" : ""}</span></figcaption>
		<div class="canvas checker">
			{#if resultUrl}
				<img src={resultUrl} alt="result" />
			{:else if running}
				<Check size={22} />
			{:else}
				<span class="empty">no result yet</span>
			{/if}
		</div>
	</figure>
</div>

<div class="meta">
	<MetaList
		items={[
			{
				caption: "SOURCE",
				value: source ? `${source.width} × ${source.height} px` : "—",
			},
			{
				caption: "RESULT",
				value: result ? `${result.width} × ${result.height} px` : "—",
			},
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
	.head-actions {
		display: flex;
		align-items: center;
		gap: var(--space-l);
		flex-wrap: wrap;
	}
	.upload {
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
	.tile figcaption {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		margin-bottom: var(--space-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
	}
	.canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: clamp(var(--space-brand), 30vh, 60vh);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		overflow: hidden;
		background: var(--color-background-muted);
		color: var(--color-text-muted);
	}
	.canvas img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}
	.canvas.checker {
		background: repeating-conic-gradient(
				var(--color-checker-main) 0 25%,
				var(--color-checker-alt) 0 50%
			)
			50% / 28px 28px;
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
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
