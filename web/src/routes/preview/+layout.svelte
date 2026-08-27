<script lang="ts">
	import "$lib/styles/design2.css";
	import type { Snippet } from "svelte";
	import AppShell from "$lib/components/kit/AppShell.svelte";
	import TopBar from "$lib/components/kit/TopBar.svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let theme = $state<"light" | "dark">("light");
	function toggle() {
		theme = theme === "light" ? "dark" : "light";
	}
</script>

<div class="preview-root" data-theme={theme}>
	<TopBar {theme} ontoggle={toggle} />
	<AppShell>{@render children()}</AppShell>
</div>
