<script lang="ts">
	import { resolve } from "$app/paths";
	import { t } from "$lib/v1/i18n/t";
	import { toolDescription, toolTitle } from "$lib/v1/i18n/tool-strings";
	import { CATEGORIES } from "$lib/v1/categories";
	import ToolCard from "$lib/v1/components/search/ToolCard.svelte";
	import { TOOLS } from "$lib/v1/registry";
</script>

<svelte:head>
	<title>{t("catalog.pageTitle")}</title>
	<meta name="description" content={t("catalog.metaDescription")} />
</svelte:head>

<h1>{t("catalog.heading")}</h1>
<p class="lead text-muted">{t("catalog.lead", { count: TOOLS.length })}</p>

{#each CATEGORIES as category (category)}
	{@const categoryTools = TOOLS.filter((tool) => tool.category === category)}
	{#if categoryTools.length > 0}
		<section
			id={category}
			class="category"
			aria-labelledby="{category}-heading"
		>
			<h2 id="{category}-heading" class="heading-section">
				{t(`categories.${category}`)}
			</h2>
			<div class="grid">
				{#each categoryTools as tool (tool.id)}
					<div class="panel">
						<ToolCard
							toolId={tool.id}
							title={toolTitle(tool)}
							description={toolDescription(tool)}
							href={resolve(`/tools/${tool.id}`)}
						/>
					</div>
				{/each}
			</div>
		</section>
	{/if}
{/each}

<style>
	h1 {
		margin-bottom: var(--space-1);
	}

	.lead {
		max-width: 48rem;
		margin-bottom: var(--space-5);
	}

	.category {
		margin-bottom: var(--space-5);
		scroll-margin-top: 5rem;
	}

	h2 {
		margin-bottom: var(--space-3);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--space-3);
	}

	.grid > .panel {
		padding: var(--space-2) var(--space-2) var(--space-3);
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast),
			transform var(--transition-fast);
	}

	.grid > .panel:hover {
		border-color: var(--accent);
		box-shadow: var(--shadow-card);
		transform: translateY(-1px);
	}
</style>
