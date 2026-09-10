<script lang="ts">
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import Footer from "$lib/components/kit/layout/Footer.svelte";
	import TopBar from "$lib/components/kit/layout/TopBar.svelte";
	import { initLocale } from "$lib/i18n/locale.svelte";
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

	const CRUMB: Record<string, string> = {
		"/list-tools": "CATALOG",
		"/tools/linear-gradient-png": "GRADIENT",
		"/tools/remove-background-png": "BACKGROUND REMOVER",
	};

	function toCrumb(path: string): string {
		return (
			"/ " +
			(CRUMB[path] ??
				path.split("/").filter(Boolean).pop()?.toUpperCase() ??
				"HOME")
		);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
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
