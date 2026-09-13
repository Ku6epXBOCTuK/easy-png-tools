<script lang="ts">
	import { PREVIEW_GROUPS, PREVIEW_TOTAL } from "$lib/catalog";
	import CatalogGroup from "$lib/components/CatalogGroup.svelte";
	import CatalogHeader from "$lib/components/CatalogHeader.svelte";
	import CatalogToolbar from "$lib/components/CatalogToolbar.svelte";
	import ToolCard from "$lib/components/ToolCard.svelte";
	import {
		searchTools,
		toolDescription,
		toolTitle,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { TOOL_ICONS } from "$lib/tool-icons";

	let query = $state("");
	let category = $state<string>("all");

	const groups = $derived(
		PREVIEW_GROUPS.map((g) => ({
			id: g.id,
			label: t(`categories.${g.id}`),
			tools: searchTools(g.tools, query).filter(
				() => category === "all" || category === g.id,
			),
		})).filter((g) => g.tools.length > 0),
	);

	// TODO: make main page different from catalog - larger and simpler search, no categories
</script>

<div class="catalog-page">
	<CatalogHeader total={PREVIEW_TOTAL} />
	<CatalogToolbar bind:query bind:category />
	<div class="catalog-groups">
		{#each groups as group (group.id)}
			<CatalogGroup label={group.label} count={group.tools.length}>
				{#each group.tools as tool, i (tool.id)}
					<ToolCard
						title={toolTitle(tool)}
						id={tool.id}
						description={toolDescription(tool)}
						index={i + 1}
						icon={TOOL_ICONS[tool.id]}
					/>
				{/each}
			</CatalogGroup>
		{/each}
	</div>
	<footer class="catalog-footer">{t("header.footerNote")}</footer>
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
