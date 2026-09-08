<script lang="ts">
	import { page } from "$app/state";
	import Footer from "$lib/components/kit/layout/Footer.svelte";
	import TopBar from "$lib/components/kit/layout/TopBar.svelte";
	import type { Snippet } from "svelte";
	import "../../preview.css";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	type Theme = "light" | "dark";
	const stored =
		typeof localStorage !== "undefined"
			? (localStorage.getItem("easy-png-tools:theme") as Theme | null)
			: null;
	let theme = $state<Theme>(stored ?? "light");

	function toggle() {
		theme = theme === "light" ? "dark" : "light";
	}

	$effect(() => {
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem("easy-png-tools:theme", theme);
		} catch {
			/* ignore */
		}
	});

	let crumb = $derived(toCrumb(page.url.pathname));

	const CRUMB: Record<string, string> = {
		"/preview/list-tools": "CATALOG",
		"/preview/tools/linear-gradient-png": "GRADIENT",
		"/preview/tools/remove-background-png": "BACKGROUND REMOVER",
	};

	function toCrumb(path: string): string {
		return (
			"/ " +
			(CRUMB[path] ??
				path.split("/").filter(Boolean).pop()?.toUpperCase() ??
				"PREVIEW")
		);
	}
</script>

<main class="preview-root" data-theme={theme}>
	<TopBar {theme} {crumb} ontoggle={toggle} />
	{@render children()}
	<Footer />
</main>

<style>
	main {
		background-color: var(--color-background);
		background-image:
			linear-gradient(var(--color-background-muted) 1px, transparent 1px),
			linear-gradient(90deg, var(--color-background-muted) 1px, transparent 1px);
		background-size: var(--space-xxxl) var(--space-xxxl);
		min-height: 100vh;
	}
</style>
