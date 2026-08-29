<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		caption: string;
		children: Snippet;
	}

	let { label, caption, children }: Props = $props();
</script>

<div class="preview-tile">
	<div class="tile-canvas">{@render children()}</div>
	<div class="tile-label">
		<span>{label}</span>
		<b>{caption}</b>
	</div>
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
	.tile-canvas {
		border-radius: var(--radius);
		overflow: hidden;
		min-height: 120px;
	}
	.tile-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.tile-label span {
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.tile-label b {
		font: 400 10px var(--font-mono);
		color: var(--muted);
	}
</style>
