<script lang="ts">
	import { page as pageState } from "$app/state";
	import EmptyState from "$lib/components/feedback/EmptyState.svelte";
	import SchemaToolView from "$lib/components/schema/SchemaToolView.svelte";
	import { getChain } from "$lib/chains.svelte";
	import { t } from "$lib/i18n/t";
	import { getTool, type Page } from "$lib/registry";
	import { Workflow as PipelineIcon } from "@lucide/svelte";
	import { onMount } from "svelte";

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const chainId = $derived(pageState.url.searchParams.get("id") ?? "");
	const chain = $derived(mounted && chainId ? getChain(chainId) : undefined);

	// Virtual page: a named chain is addressable on its own, the original
	// tool page slug no longer applies (docs/backlog.md, idea 3).
	const virtualPage = $derived<Page | undefined>(
		chain
			? {
					slug: "pipeline",
					title: chain.name,
					description: "",
					category: "convert",
					steps: chain.steps.map((s) => ({ id: s.id, params: s.params })),
				}
			: undefined,
	);
	const tool = $derived(
		virtualPage ? getTool(virtualPage.steps[0].id) : undefined,
	);
</script>

<svelte:head>
	<title>easy-png-tools / {chain?.name ?? t("header.pipeline")}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if mounted && (!chain || !virtualPage || !tool)}
	<div class="notfound">
		<EmptyState
			title={t("errors.notFound")}
			description={t("savedChains.empty")}
			icon={PipelineIcon}
		/>
	</div>
{:else if virtualPage && tool}
	<SchemaToolView page={virtualPage} {tool} {chainId} />
{/if}

<style>
	.notfound {
		max-width: var(--size-content-max-wide);
		margin: 0 auto;
		padding: var(--space-page-top)
			clamp(var(--space-xxl), 4vw, var(--space-page-bottom))
			var(--space-page-bottom);
		flex: 1;
	}
</style>
