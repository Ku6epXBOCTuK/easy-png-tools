<script lang="ts">
	import { page } from "$app/stores";
	import TopBar from "$lib/components/kit/TopBar.svelte";
	import { Link2 } from "@lucide/svelte";
	import "$lib/styles/design2.css";
	import type { Snippet } from "svelte";

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
	let status = $derived(toStatus($page.url.pathname));

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
		return "/ " + (CRUMB[path] ?? path.split("/").filter(Boolean).pop()?.toUpperCase() ?? "PREVIEW");
	}

	function toStatus(path: string): string {
		return STATUS[path] ?? "AUTO PIPELINE";
	}
</script>

<main class="preview-root" data-theme={theme}>
	<TopBar {theme} {crumb} {status} ontoggle={toggle} />
	{@render children()}
	{#if $page.url.pathname !== "/preview/list-tools"}
		<footer class="preview-footer">
			<span>easy-png-tools <b>v2.4.0</b></span>
			<span><Link2 size={13} /> pipeline is local-only</span>
			<span>© 2024</span>
		</footer>
	{/if}
</main>

<style>
	.preview-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 16px clamp(20px, 4vw, 64px);
		border-top: 1px solid var(--line);
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--muted);
	}
	.preview-footer .version {
		color: var(--blue);
	}
</style>
