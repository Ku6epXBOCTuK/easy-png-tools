<script lang="ts">
	import type { ImageInfo } from "$lib/core/analyze";
	import { LOCALE_TAGS } from "$lib/i18n/dict";
	import { getLocale } from "$lib/i18n/locale.svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		info: ImageInfo | null;
	}

	let { info }: Props = $props();
</script>

{#if info}
	<dl>
		<div class="panel">
			<dt>{t("infoPanel.dimensions")}</dt>
			<dd>{info.width} × {info.height} px</dd>
		</div>
		<div class="panel">
			<dt>{t("infoPanel.alpha")}</dt>
			<dd>
				{info.hasAlpha ? t("infoPanel.alphaYes") : t("infoPanel.alphaNo")}
			</dd>
		</div>
		<div class="panel">
			<dt>{t("infoPanel.colorCount")}</dt>
			<dd>{info.colorCount.toLocaleString(LOCALE_TAGS[getLocale()])}</dd>
		</div>
	</dl>
{/if}

<style>
	dl {
		display: grid;
		gap: var(--space-2);
		margin: var(--space-3) 0;
	}

	dl > div {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		font-family: var(--font-mono);
	}
</style>
