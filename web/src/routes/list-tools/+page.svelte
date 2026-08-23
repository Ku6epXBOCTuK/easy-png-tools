<script lang="ts">
	import { CATEGORIES } from '$lib/categories';
	import { TOOLS } from '$lib/registry';
</script>

<svelte:head>
	<title>Все инструменты — easy-png-tools</title>
	<meta
		name="description"
		content="Полный каталог PNG-утилит: конвертация, прозрачность, цвет, геометрия, анализ и генерация изображений."
	/>
</svelte:head>

<h1>Каталог инструментов</h1>
<p class="lead text-muted">
	{TOOLS.length} утилит для работы с PNG. Все операции выполняются локально в браузере.
</p>

{#each CATEGORIES as category (category.id)}
	{@const categoryTools = TOOLS.filter((tool) => tool.category === category.id)}
	{#if categoryTools.length > 0}
		<section id={category.id} class="category" aria-labelledby="{category.id}-heading">
			<h2 id="{category.id}-heading" class="heading-section">{category.label}</h2>
			<div class="grid">
				{#each categoryTools as tool (tool.id)}
					<a class="card panel" href="/tools/{tool.id}">
						<span class="card-title">{tool.title}</span>
						<span class="card-desc text-caption text-muted">{tool.description}</span>
					</a>
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

	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-3) var(--space-4);
		color: inherit;
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast),
			transform var(--transition-fast);
	}

	.card:hover {
		text-decoration: none;
		border-color: var(--accent);
		box-shadow: var(--shadow-card);
		transform: translateY(-1px);
	}

	.card-title {
		font-weight: 600;
		font-size: var(--text-m);
	}

	.card:hover .card-title {
		color: var(--accent);
	}

	.card-desc {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
