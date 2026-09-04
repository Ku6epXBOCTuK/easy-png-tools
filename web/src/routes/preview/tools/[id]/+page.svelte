<script lang="ts">
	import { getTool } from "$lib/registry";
	import ToolView from "$lib/components/kit/ToolView.svelte";
	import SchemaToolView from "$lib/components/kit/SchemaToolView.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import { SlidersHorizontal as ToolIcon } from "@lucide/svelte";

	interface Props {
		data: { id: string };
	}
	let { data }: Props = $props();

	const tool = $derived(getTool(data.id));
</script>

<svelte:head>
	<title>easy-png-tools / {tool?.title ?? "Tool"}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !tool}
	<div class="notfound">
		<EmptyState
			title="Tool not found"
			description="No tool is registered under “{data.id}”."
			icon={ToolIcon}
		/>
	</div>
{:else if tool.schema}
	<SchemaToolView {tool} />
{:else}
	<ToolView {tool} />
{/if}

<style>
	.notfound {
		max-width: 1680px;
		margin: 0 auto;
		padding: 48px clamp(24px, 4vw, 72px) 72px;
	}
</style>
