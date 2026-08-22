<script lang="ts">
	import ToolPage from '$lib/components/ToolPage.svelte';
	import { getTool } from '$lib/registry';

	let { data } = $props();

	const tool = $derived(getTool(data.id));
</script>

<svelte:head>
	<title>{tool?.title ?? 'Инструмент'} — easy-png-tools</title>
	{#if tool}
		<meta name="description" content={tool.description} />
	{/if}
</svelte:head>

{#if tool}
	<ToolPage {tool} />
{/if}
