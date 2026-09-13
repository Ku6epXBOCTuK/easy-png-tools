<script lang="ts">
	import { t } from "$lib/i18n/t";

	interface Props {
		total: number;
	}
	let { total }: Props = $props();
</script>

<div class="catalog-head">
	<div>
		<h1>{t("catalog.heading")}</h1>
		<p>{t("catalog.lead")}</p>
	</div>
	<div class="catalog-total">
		<b>{total}</b>
		<span>{t("catalog.toolsAvailable")}</span>
	</div>
</div>

<style>
	.catalog-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-xxl);
		flex-wrap: wrap;
	}
	h1 {
		margin: 0;
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-text);
	}
	p {
		margin: var(--space-m) 0 0;
		max-width: 56ch;
		color: var(--color-text-muted);
		font-size: var(--font-size-m);
	}
	.catalog-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		line-height: 1;
	}
	.catalog-total b {
		font: 700 var(--font-size-2xl) var(--font-mono);
		color: var(--color-text);
	}
	.catalog-total span {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
		text-align: right;
		margin-top: var(--space-s);
	}
</style>
