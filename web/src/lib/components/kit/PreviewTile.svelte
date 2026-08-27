<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		label: string;
		children: Snippet;
	}
	let { label, children }: Props = $props();
</script>

<div class="preview-tile">
	<MonoLabel>{label}</MonoLabel>
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
	.tile-canvas {
		border-radius: var(--radius);
		overflow: hidden;
		min-height: 120px;
	}
</style>
