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
	let status = $derived(toStatus(page.url.pathname));

	const CRUMB: Record<string, string> = {
		"/preview/demo": "WORKSPACE",
		"/preview/list-tools": "CATALOG",
		"/preview/tools/linear-gradient-png": "GRADIENT",
		"/preview/tools/remove-background-png": "BACKGROUND REMOVER",
	};

	const STATUS: Record<string, string> = {
		"/preview/demo": "AUTO PIPELINE",
		"/preview/list-tools": "LOCAL MODE / READY",
		"/preview/tools/linear-gradient-png": "LIVE PREVIEW",
		"/preview/tools/remove-background-png": "AUTO PROCESSING",
	};

	function toCrumb(path: string): string {
		return (
			"/ " +
			(CRUMB[path] ??
				path.split("/").filter(Boolean).pop()?.toUpperCase() ??
				"PREVIEW")
		);
	}

	function toStatus(path: string): string {
		return STATUS[path] ?? "AUTO PIPELINE";
	}
</script>

<main class="preview-root" data-theme={theme}>
	<TopBar {theme} {crumb} {status} ontoggle={toggle} />
	{@render children()}
	<Footer />
</main>

<style>
	main {
		background-color: var(--background);
		background-image:
			linear-gradient(var(--background-muted) 1px, #0000 1px),
			linear-gradient(90deg, var(--background-muted) 1px, #0000 1px);
		background-size: 32px 32px;
		min-height: 100vh;
	}
</style>
