<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children?: Snippet;
		size?: "sm" | "large";
	}
	let { children, size = "large" }: Props = $props();
</script>

<div class="checker-canvas checker-canvas--{size}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.checker-canvas {
		position: relative;
		display: grid;
		place-items: center;
		overflow: hidden;
		background-color: var(--color-text);
		background-image:
			linear-gradient(45deg, #1a2129 25%, transparent 25%),
			linear-gradient(-45deg, #1a2129 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #1a2129 75%),
			linear-gradient(-45deg, transparent 75%, #1a2129 75%);
		background-size: var(--space-xl) var(--space-xl);
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0;
	}

	.checker-canvas--sm {
		min-height: var(--size-preview-canvas-min-height-s);
	}

	.checker-canvas--large {
		min-height: var(--size-preview-canvas-min-height-l);
	}
</style>
