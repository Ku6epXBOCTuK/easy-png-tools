<script lang="ts">
	import { PREVIEW_GROUPS, PREVIEW_TOTAL } from "$lib/preview/catalog";
	import { TOOL_ICONS } from "$lib/preview/tool-icons";
	import CatalogHeader from "$lib/components/kit/CatalogHeader.svelte";
	import CatalogToolbar from "$lib/components/kit/CatalogToolbar.svelte";
	import CatalogGroup from "$lib/components/kit/CatalogGroup.svelte";
	import ToolCard from "$lib/components/kit/ToolCard.svelte";

	let query = $state("");
	let category = $state<string>("all");

	const groups = $derived(
		PREVIEW_GROUPS.map((g) => ({
			id: g.id,
			label: g.label,
			tools: g.tools.filter(
				(t) =>
					(category === "all" || category === g.id) &&
					(query.trim() === "" ||
						t.title.toLowerCase().includes(query.trim().toLowerCase()) ||
						t.description.toLowerCase().includes(query.trim().toLowerCase())),
			),
		})).filter((g) => g.tools.length > 0),
	);
</script>

<div class="catalog-page">
	<CatalogHeader total={PREVIEW_TOTAL} />
	<CatalogToolbar bind:query bind:category />
	<div class="catalog-groups">
		{#each groups as group (group.id)}
			<CatalogGroup label={group.label} count={group.tools.length}>
				{#each group.tools as tool, i (tool.id)}
					<ToolCard
						title={tool.title}
						id={tool.id}
						description={tool.description}
						index={i + 1}
						icon={TOOL_ICONS[tool.id]}
					/>
				{/each}
			</CatalogGroup>
		{/each}
	</div>
	<footer class="catalog-footer">
		ALL OPERATIONS RUN LOCALLY <span>•</span> YOUR FILES NEVER LEAVE THIS DEVICE
	</footer>
</div>

<style>
	.catalog-page {
		padding: var(--space-page-top)
			clamp(var(--space-xxl), 4vw, var(--space-page-bottom))
			var(--space-page-bottom);
	}
	.catalog-groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-page-top) var(--space-xxl);
	}
	.catalog-footer {
		display: flex;
		gap: var(--space-xxl);
		flex-wrap: wrap;
		margin-top: var(--space-page-top);
		padding-top: var(--space-xxl);
		border-top: 1px solid var(--color-border);
		font: 10px var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
	}
	@media (--bp-tablet) {
		.catalog-groups {
			grid-template-columns: 1fr;
		}
	}
</style>
