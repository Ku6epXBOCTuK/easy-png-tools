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
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
</style>
