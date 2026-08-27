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
		gap: 0.4rem;
		margin: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.6rem;
		background: var(--panel);
	}
	.image-canvas {
		border-radius: var(--radius);
		overflow: hidden;
	}
</style>
