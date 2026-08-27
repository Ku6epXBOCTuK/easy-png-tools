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
		background-color: #0b0f14;
		background-image:
			linear-gradient(45deg, #1a2129 25%, transparent 25%),
			linear-gradient(-45deg, #1a2129 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #1a2129 75%),
			linear-gradient(-45deg, transparent 75%, #1a2129 75%);
		background-size: 20px 20px;
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0;
	}

	.checker-canvas--sm {
		min-height: 180px;
	}

	.checker-canvas--large {
		min-height: 360px;
	}
</style>
