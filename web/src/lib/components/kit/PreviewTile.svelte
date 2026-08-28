<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		children: Snippet;
	}
	let { label, children }: Props = $props();
</script>

<div class="preview-tile">
	<span class="tile-label">{label}</span>
	<div class="tile-canvas">{@render children()}</div>
</div>

<style>
	.preview-tile {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.4rem;
		background: var(--panel);
	}
	.tile-label {
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.tile-canvas {
		border-radius: var(--radius);
		overflow: hidden;
		min-height: 120px;
	}
</style>
