<script lang="ts">
	import { PREVIEW_GROUPS, PREVIEW_TOTAL } from "$lib/catalog";
	import CatalogGroup from "$lib/components/CatalogGroup.svelte";
	import CatalogHeader from "$lib/components/CatalogHeader.svelte";
	import CatalogToolbar from "$lib/components/CatalogToolbar.svelte";
	import ToolCard from "$lib/components/ToolCard.svelte";
	import { TOOL_ICONS } from "$lib/tool-icons";

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
		gap: var(--space-page-top) var(--space-xxl);
	}
	.catalog-footer {
		display: flex;
		gap: var(--space-xxl);
		flex-wrap: wrap;
		margin-top: var(--space-page-top);
		padding-top: var(--space-xxl);
		border-top: var(--size-border) solid var(--color-border);
		font: var(--font-size-xs) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
	}
	@media (--bp-tablet) {
		.catalog-groups {
			grid-template-columns: 1fr;
		}
	}
</style>
