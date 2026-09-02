<script lang="ts">
	import type { Snippet } from "svelte";
	import PanelHeading from "../PanelHeading.svelte";

	interface Props {
		title: string;
		eyebrow: string;
		children: Snippet;
	}
	let { title, eyebrow, children }: Props = $props();
</script>

<section class="panel">
	<PanelHeading {title} {eyebrow} />
	{@render children()}
</section>

<style>
	.panel {
		background: var(--color-panel);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		padding: var(--space-l);
	}
</style>
