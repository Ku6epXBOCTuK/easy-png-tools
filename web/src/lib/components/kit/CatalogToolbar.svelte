<script lang="ts">
	import { Search, Filter } from "@lucide/svelte";

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
		{ value: "analyze", label: "ANALYZE" },
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
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1.25rem 0;
	}
	.catalog-search {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--panel);
		color: var(--muted);
	}
	.catalog-search input {
		border: none;
		background: transparent;
		outline: none;
		color: var(--foreground);
		font: 12px var(--font-mono);
	}
	.catalog-search input::placeholder {
		color: var(--muted);
	}
	.catalog-filters {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
		color: var(--muted);
	}
	.catalog-filters button {
		border: 1px solid var(--line);
		background: transparent;
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.06em;
		padding: 0.4rem 0.6rem;
		border-radius: var(--radius);
		cursor: pointer;
	}
	.catalog-filters button.active {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
</style>
