<script lang="ts">
	import EmptyState from "$lib/components/EmptyState.svelte";
	import SchemaToolView from "$lib/components/SchemaToolView.svelte";
	import { getTool } from "$lib/registry-new";
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
{:else}
	<SchemaToolView {tool} />
{/if}

<style>
	.notfound {
		max-width: var(--size-content-max-wide);
		margin: 0 auto;
		padding: var(--space-page-top)
			clamp(var(--space-xxl), 4vw, var(--space-page-bottom))
			var(--space-page-bottom);
	}
</style>
