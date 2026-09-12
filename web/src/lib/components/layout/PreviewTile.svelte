<script lang="ts">
	import type { InputMode, ResultKind } from "$lib/registry";
	import { RefreshCw } from "@lucide/svelte";
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		viewMode: InputMode | ResultKind;
		children: Snippet;
		loading?: boolean;
		parts?: number;
	}
	let {
		label,
		viewMode: mode,
		children,
		loading = false,
		parts = undefined,
	}: Props = $props();

	// TODO: make canvas aspect ratio auto, from 16:9 to 9:16 max
</script>

<figure class="tile">
	<figcaption>
		<span>
			{label}
			{#if parts !== undefined}
				<span class="count">{parts} parts</span>
			{/if}
			{#if loading}
				<RefreshCw class="rotating" size="12" />
			{/if}
		</span>
	</figcaption>
	<div class="canvas" class:checker={mode === "image"}>
		{@render children()}
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
	.count {
		margin-left: var(--space-m);
		color: var(--color-main);
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
	.canvas :global(img) {
		width: auto;
		max-width: 100%;
		height: auto;
		max-height: 100vh;
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
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
