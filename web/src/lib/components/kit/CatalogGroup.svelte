<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		count: number;
		children: Snippet;
	}
	let { label, count, children }: Props = $props();
</script>

<section class="catalog-group">
	<div class="group-title">
		<span>{label}</span>
		<i>{count.toString().padStart(2, "0")} <!-- --> TOOLS</i>
	</div>
	<div class="tool-cards">
		{@render children()}
	</div>
</section>

<style>
	.catalog-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}
	.group-title {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-xl);
		padding-bottom: var(--space-m);
		border-bottom: 1px solid var(--color-border);
	}
	.group-title span {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-xl);
		color: var(--color-text);
	}
	.group-title i {
		font: var(--font-size-s) var(--font-mono);
		font-style: normal;
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
	}
	.tool-cards {
		display: grid;
		gap: var(--space-m);
	}
</style>
