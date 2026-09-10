<script lang="ts">
	import { resolve } from "$app/paths";
	import favicon from "$lib/assets/favicon.svg";
	import { LOCALES, type Locale } from "$lib/i18n/dict";
	import { getLocale, initLocale, setLocale } from "$lib/i18n/locale.svelte";
	import { t } from "$lib/i18n/t";
	import { getTheme, initTheme, setTheme } from "$lib/theme.svelte";
	import { onMount } from "svelte";
	import "../../app_v1.css";

	let { children } = $props();

	onMount(() => {
		initLocale();
		initTheme();
	});

	const LANG_LABELS: Record<Locale, string> = { ru: "RU", en: "EN" };
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header>
		<a href={resolve("/v1")} class="brand">easy-png-tools</a>
		<nav aria-label={t("header.sectionsAria")}>
			<a class="nav-link workspace-link" href={resolve("/v1")}>
				{t("header.workspace")}
			</a>
			<a class="nav-link" href={resolve("/v1/list-tools")}>
				{t("header.catalog")}
			</a>
			<div class="lang-switch" role="group" aria-label="Language / Язык">
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
			<div class="theme-switch" role="group" aria-label="Theme / Тема">
				<button
					type="button"
					class="lang-btn"
					class:active={getTheme() === "light"}
					aria-pressed={getTheme() === "light"}
					title={t("ui.themeLight")}
					aria-label={t("ui.themeLight")}
					onclick={() => setTheme("light")}
				>
					☀
				</button>
				<button
					type="button"
					class="lang-btn"
					class:active={getTheme() === "dark"}
					aria-pressed={getTheme() === "dark"}
					title={t("ui.themeDark")}
					aria-label={t("ui.themeDark")}
					onclick={() => setTheme("dark")}
				>
					☾
				</button>
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p class="text-caption text-muted">{t("header.footerNote")}</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		flex-wrap: wrap;
		padding: var(--space-3) var(--space-4);
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--text);
	}

	.brand:hover {
		text-decoration: none;
		color: var(--link);
	}

	nav {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.nav-link {
		color: var(--text-muted);
		font-size: var(--text-s);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-s);
	}

	.nav-link:hover {
		color: var(--link);
		background: var(--bg);
		text-decoration: none;
	}

	.lang-switch,
	.theme-switch {
		display: flex;
		gap: 2px;
		margin-left: var(--space-2);
		padding: 2px;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--bg);
	}

	.lang-btn {
		border: none;
		background: transparent;
		color: var(--text-muted);
		font-size: var(--text-s);
		font-weight: 600;
		padding: 2px 8px;
		border-radius: calc(var(--radius-s) - 1px);
		cursor: pointer;
	}

	.lang-btn:hover {
		color: var(--link);
	}

	.lang-btn.active {
		background: var(--accent);
		color: var(--bg);
	}

	.workspace-link {
		font-weight: 600;
		color: var(--link);
	}
	main {
		flex: 1;
		width: 100%;
		padding: var(--space-4) var(--space-5);
	}
	footer {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--border);
		text-align: center;
	}
</style>
