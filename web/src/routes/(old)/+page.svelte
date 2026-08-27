<script lang="ts">
	import { getTool } from '$lib/registry';
	import { t } from '$lib/i18n/t';
	import { toolTitle } from '$lib/i18n/tool-strings';
	import ToolPage from '$lib/components/ToolPage.svelte';
	import ToolSearch from '$lib/components/search/ToolSearch.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const LAST_TOOL_KEY = 'last-tool-id';

	function loadLastToolId(): string | null {
		if (typeof localStorage === 'undefined') return null;
		try {
			const id = localStorage.getItem(LAST_TOOL_KEY);
			return id !== null && getTool(id) ? id : null;
		} catch {
			return null;
		}
	}

	let selectedId = $state<string | null>(null);
	let restoreOnOpen = $state(false);
	let lastToolId = $state<string | null>(loadLastToolId());

	function openTool(id: string, restore = false) {
		if (!getTool(id)) return;
		selectedId = id;
		restoreOnOpen = restore;
		lastToolId = id;
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem(LAST_TOOL_KEY, id);
		} catch {
			// приватный режим — просто не запоминаем
		}
	}

	function closeTool() {
		selectedId = null;
	}

	let selected = $derived(selectedId !== null ? (getTool(selectedId) ?? null) : null);
</script>

<svelte:head>
	<title>
		{selected ? `${selected.title} — easy-png-tools` : t('home.defaultTitle')}
	</title>
</svelte:head>

{#if !selected}
	<section class="hero">
		<h1>{t('home.heroTitle')}</h1>
		<p class="lead text-muted">{t('home.heroLead')}</p>
		<ToolSearch onSelect={(id) => openTool(id)} />
		{#if lastToolId !== null && getTool(lastToolId)}
			{@const restoreId = lastToolId}
			<div class="restore-row">
				<Button variant="secondary" fullWidth onclick={() => openTool(restoreId, true)}>
					{t('home.restoreLast', { title: getTool(restoreId) ? toolTitle(getTool(restoreId)!) : '' })}
				</Button>
			</div>
		{/if}
	</section>
{:else}
	<section class="workbench">
		<button type="button" class="back text-caption text-muted" onclick={closeTool}>
			{t('home.changeTool')}
		</button>
		{#key selectedId}
			<ToolPage tool={selected} restoreChain={restoreOnOpen} />
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

	.restore-row {
		max-width: 36rem;
		margin: var(--space-2) auto 0;
	}

	.back {
		display: inline-block;
		margin-bottom: var(--space-3);
		border: 0;
		background: none;
		cursor: pointer;
	}

	.back:hover {
		color: var(--link);
	}
</style>
