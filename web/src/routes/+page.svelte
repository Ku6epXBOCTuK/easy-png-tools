<script lang="ts">
	import { getTool } from '$lib/registry';
	import ToolPage from '$lib/components/ToolPage.svelte';
	import ToolSearch from '$lib/components/search/ToolSearch.svelte';

	let selectedId = $state<string | null>(null);

	let selected = $derived(selectedId !== null ? (getTool(selectedId) ?? null) : null);
</script>

<svelte:head>
	<title>
		{selected ? `${selected.title} — easy-png-tools` : 'easy-png-tools — PNG-утилиты прямо в браузере'}
	</title>
</svelte:head>

{#if !selected}
	<section class="hero">
		<h1>Что делаем с изображением?</h1>
		<p class="lead text-muted">Найдите инструмент — все операции выполняются локально в браузере.</p>
		<ToolSearch onSelect={(id) => (selectedId = id)} />
	</section>
{:else}
	<section class="workbench">
		<button type="button" class="back text-caption text-muted" onclick={() => (selectedId = null)}>
			← Сменить инструмент
		</button>
		{#key selectedId}
			<ToolPage tool={selected} />
		{/key}
	</section>
{/if}

<style>
	.hero {
		text-align: center;
		padding-top: var(--space-5);
	}

	h1 {
		margin-bottom: var(--space-2);
	}

	.lead {
		max-width: 40rem;
		margin: 0 auto var(--space-4);
	}

	.back {
		display: inline-block;
		margin-bottom: var(--space-3);
		border: 0;
		background: none;
		cursor: pointer;
	}

	.back:hover {
		color: var(--accent);
	}
</style>
