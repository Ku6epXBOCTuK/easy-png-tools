<script lang="ts">
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import type { FileResult } from "$lib/registry";
	import { Check, RefreshCw } from "@lucide/svelte";
	import SchemaTextResult from "./SchemaTextResult.svelte";

	interface Props {
		resultKind?: "image" | "text" | "verdict" | "files";
		result: PixelImage | null;
		fileResult?: FileResult | null;
		textResult?: string | null;
		running?: boolean;
		oncopy?: () => void;
		ondownloadtxt?: () => void;
	}
	let {
		resultKind = "image",
		result,
		fileResult = null,
		textResult = null,
		running = false,
		oncopy,
		ondownloadtxt,
	}: Props = $props();

	const resultUrl = $derived(result ? toDataUrl(result) : null);
	const partUrls = $derived(
		resultKind === "files" && fileResult
			? fileResult.files.map((file) => ({
					name: file.name,
					url: toDataUrl(file.image),
				}))
			: [],
	);
</script>

<figure class="tile">
	<figcaption>
		<span>
			RESULT
			{#if resultKind === "files" && fileResult}
				<span class="count">{fileResult.files.length} parts</span>
			{/if}
			{#if running}
				<RefreshCw class="rotating" size="16" />
			{/if}
		</span>
	</figcaption>
	<div class="canvas" class:checker={resultKind === "image"}>
		{#if resultKind === "text" && textResult}
			<div class="text-result-wrap">
				<SchemaTextResult
					value={textResult}
					kind="text"
					oncopy={oncopy ?? (() => {})}
					ondownload={ondownloadtxt ?? (() => {})}
				/>
			</div>
		{:else if resultKind === "verdict" && textResult}
			<div class="text-result-wrap">
				<SchemaTextResult
					value={textResult}
					kind="verdict"
					oncopy={oncopy ?? (() => {})}
					ondownload={ondownloadtxt ?? (() => {})}
				/>
			</div>
		{:else if resultKind === "files" && partUrls.length > 0}
			<div class="parts-grid">
				{#each partUrls as part (part.name)}
					<figure class="part">
						<img src={part.url} alt={part.name} loading="lazy" />
						<figcaption>{part.name}</figcaption>
					</figure>
				{/each}
			</div>
		{:else if resultKind === "image" && resultUrl}
			<img src={resultUrl} alt="result" />
		{:else if running}
			<Check size={22} />
		{:else}
			<span class="empty">no result yet</span>
		{/if}
	</div>
</figure>

<style>
	.tile figcaption {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		margin-bottom: var(--space-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		& :global(.rotating) {
			animation: rotate var(--duration-l) linear infinite;
		}
	}
	.canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: clamp(var(--space-brand), 30vh, 60vh);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		overflow: auto;
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
	.count {
		margin-left: var(--space-m);
		color: var(--color-main);
	}
	.parts-grid {
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(var(--size-parts-grid-min), 1fr)
		);
		gap: var(--space-m);
		width: 100%;
		height: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
		align-content: start;
	}
	.part {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}
	.part img {
		width: 100%;
		height: auto;
		display: block;
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		background: repeating-conic-gradient(
				var(--color-checker-main) 0 25%,
				var(--color-checker-alt) 0 50%
			)
			50% / 16px 16px;
	}
	.part figcaption {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		text-align: center;
		overflow-wrap: anywhere;
	}
	.text-result-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
