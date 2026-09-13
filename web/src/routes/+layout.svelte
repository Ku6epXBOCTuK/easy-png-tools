<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import Footer from "$lib/components/layout/Footer.svelte";
	import TopBar from "$lib/components/layout/TopBar.svelte";
	import { initLocale } from "$lib/i18n/locale.svelte";
	import { toolTitle } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { getTool } from "$lib/registry";
	import { getTheme, initTheme, setTheme } from "$lib/theme.svelte";
	import type { Snippet } from "svelte";
	import { onMount } from "svelte";
	import "../app.css";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let theme = $derived(getTheme());

	function toggle() {
		setTheme(theme === "light" ? "dark" : "light");
	}

	onMount(() => {
		initLocale();
		initTheme();
	});

	let crumb = $derived(toCrumb(page.url.pathname));

	function toCrumb(path: string): string {
		if (path === "/") return "/ " + t("header.home");
		if (path === "/list-tools") return "/ " + t("header.catalog");
		if (path === "/kit") return "/ " + t("header.uiKit");
		const match = /^\/tools\/([^/]+)$/.exec(path);
		if (match) {
			const tool = getTool(match[1]);
			if (tool) return "/ " + toolTitle(tool);
		}
		return "/ " + t("header.home");
	}
</script>

<svelte:head>
	<link rel="icon" href={`${resolve("/")}favicon.svg`} />
</svelte:head>

<main class="preview-root" data-theme={theme}>
	<TopBar {theme} {crumb} ontoggle={toggle} />
	{@render children()}
	<Footer />
</main>

<style>
	.preview-root {
		background-color: var(--color-background);
		background-image:
			linear-gradient(var(--color-background-muted) 1px, transparent 1px),
			linear-gradient(90deg, var(--color-background-muted) 1px, transparent 1px);
		background-size: var(--space-xxxl) var(--space-xxxl);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	@layer app, design;
</style>
