<script lang="ts">
	import { resolve } from "$app/paths";
	import { CircleQuestionMark, Moon, Sun } from "@lucide/svelte";
	import IconButton from "./IconButton.svelte";
	import StatusDot from "./StatusDot.svelte";

	interface Props {
		theme: "light" | "dark";
		crumb?: string;
		status?: string;
		ontoggle: () => void;
	}

	let { theme, crumb, status = "AUTO PIPELINE", ontoggle }: Props = $props();

	let lang = $state("RU");
</script>

<header class="topbar">
	<a class="brand" href={resolve("/")}>
		<span class="brand-mark">EP</span>
		<span>easy-png-tools</span>
		{#if crumb}<span class="version">{crumb}</span>{/if}
	</a>
	<nav class="nav">
		<a href={resolve("/preview/demo")}>Workspace</a>
		<a href={resolve("/preview/list-tools")}>Catalog</a>
		<a href={resolve("/preview/tools/linear-gradient-png")}>Gradient</a>
		<a href={resolve("/preview/tools/remove-background-png")}
			>Background remover</a
		>
	</nav>
	<div class="top-actions">
		<span class="status"><StatusDot /> {status}</span>
		<IconButton
			icon={CircleQuestionMark}
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
			><span class="lang-div">/</span>
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
		text-decoration: none;
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
		gap: 22px;
		margin-right: 28px;
		margin-left: auto;
	}
	.nav a {
		color: var(--muted);
		font: 10px var(--font-mono);
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
		display: flex;
		align-items: center;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.lang-btn {
		border: 0;
		background: transparent;
		color: var(--muted);
		font: 10px var(--font-mono);
		padding: 6px 9px;
		cursor: pointer;
	}
	.lang-div {
		color: var(--foreground);
		font-family: var(--font-sans);
	}
	.lang-btn.active {
		background: var(--foreground);
		color: var(--background);
	}
</style>
