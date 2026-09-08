<script lang="ts">
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { Check, RefreshCw } from "@lucide/svelte";
	import SchemaTextResult from "./SchemaTextResult.svelte";

	interface Props {
		resultKind?: "image" | "text" | "verdict";
		result: PixelImage | null;
		textResult?: string | null;
		wide?: boolean;
		running?: boolean;
		oncopy?: () => void;
		ondownloadtxt?: () => void;
	}
	let {
		resultKind = "image",
		result,
		textResult = null,
		wide = false,
		running = false,
		oncopy,
		ondownloadtxt,
	}: Props = $props();

	const resultUrl = $derived(result ? toDataUrl(result) : null);
</script>

<figure class="tile" style:grid-column={wide ? "1 / -1" : undefined}>
	<figcaption>
		<span>
			RESULT
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
