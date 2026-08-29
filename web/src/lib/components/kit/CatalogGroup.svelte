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
		<i>{count} <!-- --> TOOLS</i>
	</div>
	<div class="tool-cards">
		{@render children()}
	</div>
</section>

<style>
	.catalog-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.group-title {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--line);
	}
	.group-title span {
		font: 12px var(--font-mono);
		letter-spacing: 0.14em;
		color: var(--foreground);
	}
	.group-title i {
		font: 10px var(--font-mono);
		font-style: normal;
		letter-spacing: 0.08em;
		color: var(--muted);
	}
	.tool-cards {
		display: grid;
		gap: 10px;
	}
</style>
