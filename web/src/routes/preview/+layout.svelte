<script lang="ts">
	import "$lib/styles/design2.css";
	import type { Snippet } from "svelte";
	import AppShell from "$lib/components/kit/AppShell.svelte";
	import IconButton from "$lib/components/kit/IconButton.svelte";
	import { Sun, Moon } from "@lucide/svelte";

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
	<AppShell>{@render children()}</AppShell>
	<div class="theme-switch">
		<IconButton
			icon={theme === "light" ? Moon : Sun}
			label="Toggle theme"
			onclick={toggle}
		/>
	</div>
</div>

<style>
	.preview-root {
		display: block;
	}
	.theme-switch {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 20;
	}
</style>
