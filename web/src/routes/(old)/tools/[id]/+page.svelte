<script lang="ts">
	import ToolPage from '$lib/components/ToolPage.svelte';
	import { getTool } from '$lib/registry';
	import { t } from '$lib/i18n/t';
	import { toolDescription, toolTitle } from '$lib/i18n/tool-strings';

	let { data } = $props();

	const tool = $derived(getTool(data.id));
</script>

<svelte:head>
	<title>{tool ? toolTitle(tool) : t('toolPage.fallbackTitle')} — easy-png-tools</title>
	{#if tool}
		<meta name="description" content={toolDescription(tool)} />
	{/if}
</svelte:head>

{#if tool}
	<ToolPage {tool} />
{/if}
