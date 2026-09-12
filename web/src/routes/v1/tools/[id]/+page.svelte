<script lang="ts">
	import { t } from "$lib/v1/i18n/t";
	import { toolDescription, toolTitle } from "$lib/v1/i18n/tool-strings";
	import ToolPage from "$lib/v1/components/ToolPage.svelte";
	import { getTool } from "$lib/v1/registry";

	let { data } = $props();

	const tool = $derived(getTool(data.id));
</script>

<svelte:head>
	<title
		>{tool ? toolTitle(tool) : t("toolPage.fallbackTitle")} — easy-png-tools</title
	>
	{#if tool}
		<meta name="description" content={toolDescription(tool)} />
	{/if}
</svelte:head>

{#if tool}
	<ToolPage {tool} />
{/if}
