<script lang="ts">
	import { Funnel, Search } from "@lucide/svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		query: string;
		category: string;
	}
	let { query = $bindable(), category = $bindable() }: Props = $props();

	const FILTERS = [
		{ value: "all", label: t("categories.all") },
		{ value: "convert", label: t("categories.convert") },
		{ value: "alpha", label: t("categories.alpha") },
		{ value: "color", label: t("categories.color") },
		{ value: "geometry", label: t("categories.geometry") },
		{ value: "filters", label: t("categories.filters") },
		{ value: "text", label: t("categories.text") },
		{ value: "analyze", label: t("categories.analyze") },
		{ value: "generate", label: t("categories.generate") },
	];

	// TODO: Button component
</script>

<div class="catalog-toolbar">
	<label class="catalog-search">
		<Search size={16} />
		<input
			aria-label={t("search.aria")}
			placeholder={t("search.placeholder")}
			bind:value={query}
		/>
	</label>
	<div class="catalog-filters">
		<Funnel size={15} />
		{#each FILTERS as f (f.value)}
			<button
				type="button"
				class:active={category === f.value}
				onclick={() => (category = f.value)}
			>
				{f.label}
			</button>
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
		border: var(--size-border) solid var(--color-border);
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
		border: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
		text-transform: uppercase;
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
