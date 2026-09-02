<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<section class="panel">
	{@render children()}
</section>

<style>
	.panel {
		background: var(--color-panel);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
	}
</style>
