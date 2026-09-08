<script lang="ts">
	import { Filter, Search } from "@lucide/svelte";

	interface Props {
		query: string;
		category: string;
	}
	let { query = $bindable(), category = $bindable() }: Props = $props();

	const FILTERS = [
		{ value: "all", label: "ALL" },
		{ value: "convert", label: "CONVERT" },
		{ value: "alpha", label: "TRANSPARENCY" },
		{ value: "color", label: "COLOR" },
		{ value: "geometry", label: "GEOMETRY" },
		{ value: "filters", label: "FILTERS" },
		{ value: "text", label: "TEXT" },
		{ value: "analyze", label: "ANALYZE" },
		{ value: "generate", label: "GENERATE" },
	];
</script>

<div class="catalog-toolbar">
	<label class="catalog-search">
		<Search size={16} />
		<input
			aria-label="Search tools"
			placeholder="Search tools..."
			bind:value={query}
		/>
	</label>
	<div class="catalog-filters">
		<Filter size={15} />
		{#each FILTERS as f (f.value)}
			<button
				type="button"
				class:active={category === f.value}
				onclick={() => (category = f.value)}>{f.label}</button
			>
		{/each}
	</div>
</div>

<style>
	.catalog-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		flex-wrap: wrap;
		padding: var(--space-xl) 0;
	}
	.catalog-search {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
		color: var(--color-text-muted);
	}
	.catalog-search input {
		border: none;
		background: transparent;
		outline: none;
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
	.catalog-search input::placeholder {
		color: var(--color-text-muted);
	}
	.catalog-filters {
		display: inline-flex;
		align-items: center;
		gap: var(--space-s);
		flex-wrap: wrap;
		color: var(--color-text-muted);
	}
	.catalog-filters button {
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
		padding: var(--space-s) var(--space-m);
		border-radius: var(--radius-m);
		cursor: pointer;
	}
	.catalog-filters button.active {
		background: var(--color-main);
		color: var(--color-background);
		border-color: var(--color-main);
	}
</style>
