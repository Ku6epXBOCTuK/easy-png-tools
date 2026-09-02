<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		caption: string;
		active?: boolean;
		children: Snippet;
	}

	let { label, caption, active = false, children }: Props = $props();
</script>

<div class="preview-tile" class:active>
	<div class="tile-canvas">{@render children()}</div>
	<div class="tile-label">
		<span>{label}</span>
		<b>{caption}</b>
	</div>
</div>

<style>
	.preview-tile {
		width: 100%;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--line);
		background: var(--background);
		&.active {
			border-color: var(--blue);
		}
	}
	.tile-canvas {
		width: 100%;
		min-width: 0;
		min-height: 260px;
		min-height: clamp(300px, 22vw, 430px);
		overflow: hidden;
		aspect-ratio: 1.35;
		background-color: var(--checker-background);
		background-image:
			linear-gradient(45deg, var(--checker-background-cross) 25%, #0000 25%),
			linear-gradient(-45deg, var(--checker-background-cross) 25%, #0000 25%),
			linear-gradient(45deg, #0000 75%, var(--checker-background-cross) 75%),
			linear-gradient(-45deg, #0000 75%, var(--checker-background-cross) 75%);
		background-position:
			0 0,
			0 7px,
			7px -7px,
			-7px 0;
		background-size: 14px 14px;
		place-items: center;
		padding: 16px;
		display: grid;
	}
	.tile-label {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding: 8px;
		border-top: 1px solid var(--line);
		font: 9px var(--font-mono);
		color: var(--blue);
	}
	.tile-label span {
		font: 9px var(--font-mono);
		color: var(--blue);
	}
	.tile-label b {
		font: 400 9px var(--font-mono);
		color: var(--muted);
		text-align: right;
	}
</style>
