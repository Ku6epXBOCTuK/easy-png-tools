<script lang="ts">
	import { LOCALES, type Locale } from "$lib/i18n/dict";
	import { getLocale, setLocale } from "$lib/i18n/locale.svelte";
	import { t } from "$lib/i18n/t";

	const LANG_LABELS: Record<Locale, string> = { ru: "RU", en: "EN" };
</script>

<div class="lang" role="group" aria-label={t("ui.language")}>
	{#each LOCALES as l (l)}
		<button
			type="button"
			class="lang-btn"
			class:active={getLocale() === l}
			aria-pressed={getLocale() === l}
			onclick={() => setLocale(l)}
		>
			{LANG_LABELS[l]}
		</button>
	{/each}
</div>

<style>
	.lang {
		display: flex;
		align-items: center;
		border: var(--size-border) solid var(--color-border);
	}
	.lang-btn {
		border: 0;
		background: transparent;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		padding: var(--space-s) var(--space-m);
		cursor: pointer;
	}
	.lang-btn.active {
		background: var(--color-text);
		color: var(--color-background);
	}
</style>
