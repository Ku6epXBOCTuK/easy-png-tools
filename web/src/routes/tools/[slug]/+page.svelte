<script lang="ts">
	import EmptyState from "$lib/components/feedback/EmptyState.svelte";
	import SchemaToolView from "$lib/components/schema/SchemaToolView.svelte";
	import Seo from "$lib/components/Seo.svelte";
	import { pageDescription, pageTitle } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { getPageBySlug, getTool } from "$lib/registry";
	import { SlidersHorizontal as ToolIcon } from "@lucide/svelte";

	interface Props {
		data: { slug: string };
	}
	let { data }: Props = $props();

	const page = $derived(getPageBySlug(data.slug));
	const tool = $derived(page ? getTool(page.steps[0].id) : undefined);
</script>

{#if page}
	<Seo
		title={`easy-png-tools / ${pageTitle(page)}`}
		description={pageDescription(page)}
		path={`/tools/${page.slug}`}
	/>
{/if}
<svelte:head>
	{#if !page}
		<title>easy-png-tools / {t("toolPage.fallbackTitle")}</title>
	{/if}
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !page || !tool}
	<div class="notfound">
		<EmptyState
			title={t("errors.notFound")}
			description={t("errors.pageUnknown", { slug: data.slug })}
			icon={ToolIcon}
		/>
	</div>
{:else}
	<SchemaToolView {page} {tool} />
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
