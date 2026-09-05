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
						href={`/preview/tools/${tool.id}`}
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
		padding: 60px clamp(24px, 4vw, 72px) 72px;
	}
	.catalog-groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 56px 28px;
	}
	.catalog-footer {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-top: 56px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--muted);
	}
	@media (max-width: 800px) {
		.catalog-groups {
			grid-template-columns: 1fr;
		}
	}
</style>
