<script lang="ts">
	import IconButton from "./IconButton.svelte";
	import StatusDot from "./StatusDot.svelte";
	import { resolve } from "$app/paths";
	import { CircleHelp, Moon, Sun } from "@lucide/svelte";

	interface Props {
		theme: "light" | "dark";
		crumb?: string;
		ontoggle: () => void;
	}

	let { theme, crumb, ontoggle }: Props = $props();

	let lang = $state("RU");
</script>

	<header class="topbar">
		<div class="brand">
			<span class="brand-mark">EP</span>
			<span>easy-png-tools</span>
			{#if crumb}<span class="version">{crumb}</span>{/if}
		</div>
		<nav class="nav">
			<a href={resolve("/preview/demo")}>Workspace</a>
			<a href={resolve("/preview/list-tools")}>Catalog</a>
			<a href={resolve("/preview/tools/linear-gradient-png")}>Gradient</a>
			<a href={resolve("/preview/tools/remove-background-png")}>Background remover</a>
		</nav>
		<div class="top-actions">
		<span class="status"><StatusDot /> AUTO PIPELINE</span>
		<IconButton
			icon={CircleHelp}
			label="Help"
			variant="bare"
			onclick={() => {}}
		/>
		<IconButton
			icon={theme === "light" ? Moon : Sun}
			label="Toggle theme"
			variant="bare"
			onclick={ontoggle}
		/>
		<div class="lang" role="group" aria-label="Language">
			<button
				type="button"
				class="lang-btn"
				class:active={lang === "RU"}
				onclick={() => (lang = "RU")}>RU</button
			>
			<button
				type="button"
				class="lang-btn"
				class:active={lang === "EN"}
				onclick={() => (lang = "EN")}>EN</button
			>
		</div>
	</div>
</header>

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		padding: 0 clamp(20px, 4vw, 64px);
		background: var(--panel);
		border-bottom: 1px solid var(--line);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font: 600 14px var(--font-mono);
		color: var(--foreground);
	}
	.brand-mark {
		background: var(--blue);
		color: #fff;
		width: 30px;
		height: 30px;
		font-size: 11px;
		display: grid;
		place-items: center;
	}
	.version {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--blue);
	}
	.nav {
		display: flex;
		align-items: center;
		gap: 18px;
		margin-left: 24px;
	}
	.nav a {
		color: var(--muted);
		font: 12px var(--font-mono);
		letter-spacing: 0.04em;
		text-decoration: none;
	}
	.nav a:hover {
		color: var(--foreground);
	}
	.top-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
	}
	.lang {
		display: inline-flex;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.lang-btn {
		border: 0;
		background: transparent;
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.06em;
		padding: 6px 9px;
		cursor: pointer;
	}
	.lang-btn + .lang-btn {
		border-left: 1px solid var(--line);
	}
	.lang-btn.active {
		background: var(--foreground);
		color: var(--background);
	}
</style>
