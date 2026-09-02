<script lang="ts">
	import { resolve } from "$app/paths";
	import LangToggle from "../ui/LangToggle.svelte";
	import ThemeToggle from "../ui/ThemeToggle.svelte";
	import TopNav from "../ui/TopNav.svelte";

	interface Props {
		theme: "light" | "dark";
		crumb?: string;
		ontoggle: () => void;
	}

	let { theme, crumb, ontoggle }: Props = $props();
</script>

<header class="topbar">
	<a class="brand" href={resolve("/")}>
		<span class="brand-mark">EP</span>
		<span>easy-png-tools</span>
		{#if crumb}
			<span class="version">{crumb}</span>
		{/if}
	</a>
	<TopNav />
	<div class="top-actions">
		<ThemeToggle {theme} {ontoggle} />
		<LangToggle />
	</div>
</header>

<style>
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-xl);
		background: var(--color-background);
		border-bottom: var(--size-border) solid var(--color-border);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		font: bold var(--font-button) var(--font-mono);
		color: var(--color-text);
		text-decoration: none;
	}
	.brand-mark {
		background: var(--color-main);
		color: var(--color-background);
		width: var(--space-brand);
		height: var(--space-brand);
		font-size: var(--font-brand);
		display: grid;
		place-items: center;
	}
	.version {
		font: var(--font-text) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-main);
	}
	.top-actions {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
	}
</style>
