<script lang="ts">
	import "$lib/styles/design2.css";
	import type { Snippet } from "svelte";
	import { page } from "$app/stores";
	import AppShell from "$lib/components/kit/AppShell.svelte";
	import TopBar from "$lib/components/kit/TopBar.svelte";

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

	let crumb = $derived(toCrumb($page.url.pathname));

	function toCrumb(path: string): string {
		const seg = path
			.replace(/^\/preview/, "")
			.replace(/^\//, "")
			.split("/")
			.filter(Boolean);
		const label = seg.length ? seg.join(" / ").toUpperCase() : "PREVIEW";
		return "/ " + label;
	}
</script>

<div class="preview-root" data-theme={theme}>
	<TopBar {theme} {crumb} ontoggle={toggle} />
	<AppShell>{@render children()}</AppShell>
</div>
