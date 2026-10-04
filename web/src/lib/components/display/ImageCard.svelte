<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		label: string;
		children: Snippet;
	}
	let { label, children }: Props = $props();
</script>

<figure class="image-card">
	<MonoLabel>{label}</MonoLabel>
	<div class="image-canvas">{@render children()}</div>
</figure>

<style>
	.image-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		margin: 0;
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		padding: var(--space-m);
		background: var(--color-panel);
	}
	.image-canvas {
		border-radius: var(--radius-m);
		overflow: hidden;
	}
</style>
