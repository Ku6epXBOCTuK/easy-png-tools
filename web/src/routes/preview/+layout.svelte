<script lang="ts">
	import { page } from "$app/stores";
	import AppShell from "$lib/components/kit/AppShell.svelte";
	import TopBar from "$lib/components/kit/TopBar.svelte";
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
	<footer class="preview-footer">
		<span class="version">v0.1.0</span>
		<span class="copy">© 2026</span>
	</footer>
</div>

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
