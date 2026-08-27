<script lang="ts">
	import { TOOLS } from "$lib/registry";
	import { CATEGORIES, type CategoryId } from "$lib/categories";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import ToolCard from "$lib/components/kit/ToolCard.svelte";

	const TITLES: Record<CategoryId, string> = {
		convert: "Convert",
		alpha: "Alpha & transparency",
		color: "Color",
		geometry: "Geometry",
		filters: "Filters",
		text: "Text",
		analyze: "Analyze",
		generate: "Generate",
	};

	const groups = CATEGORIES.map((cat) => ({
		id: cat,
		title: TITLES[cat],
		tools: TOOLS.filter((t) => t.category === cat),
	}));
</script>

<section class="catalog">
	<header class="cat-head">
		<span class="cat-eyebrow">CATALOG</span>
		<h1 class="cat-title">All tools</h1>
		<p class="cat-lede">
			Каталог всех PNG-инструментов, сгруппированный по назначению.
		</p>
	</header>

	{#each groups as group (group.id)}
		<Panel>
			<PanelHeading title={group.title} eyebrow={group.id} />
			<div class="cat-grid">
				{#each group.tools as tool (tool.id)}
					<ToolCard
						title={tool.title}
						href="#"
						description={tool.description}
					/>
				{/each}
			</div>
		</Panel>
	{/each}
</section>

<style>
	.catalog {
		max-width: 880px;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.cat-head {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.cat-eyebrow {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.18em;
		color: var(--muted);
	}
	.cat-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: var(--foreground);
	}
	.cat-lede {
		margin: 0;
		max-width: 56ch;
		color: var(--muted);
		font-size: 0.95rem;
	}
	.cat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.75rem;
		padding: 0.75rem 1rem 1rem;
	}
</style>
