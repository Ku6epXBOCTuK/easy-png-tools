<script lang="ts">
	import { resolve } from "$app/paths";
	import BrandIcon from "$lib/components/ui/BrandIcon.svelte";
	import LangToggle from "$lib/components/ui/LangToggle.svelte";
	import ThemeToggle from "$lib/components/ui/ThemeToggle.svelte";
	import { t } from "$lib/i18n/t";
	import { siGithub, siTelegram, siTwitch } from "simple-icons";
	import TopNav from "./TopNav.svelte";

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
			<span class="crumb">{crumb}</span>
		{/if}
	</a>
	<TopNav />
	<div class="top-actions">
		<a
			class="social"
			href="https://github.com/Ku6epXBOCTuK/easy-png-tools"
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t("ui.github")}
		>
			<BrandIcon path={siGithub.path} size={16} />
		</a>
		<a
			class="social"
			href="https://t.me/Ku6epXBOCTuK_feed"
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t("ui.telegram")}
		>
			<BrandIcon path={siTelegram.path} size={16} />
		</a>
		<a
			class="social"
			href="https://www.twitch.tv/ku6epxboctuk"
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t("ui.twitch")}
		>
			<BrandIcon path={siTwitch.path} size={16} />
		</a>
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
		font: bold var(--font-size-l) var(--font-mono);
		color: var(--color-text);
		text-decoration: none;
	}
	.brand-mark {
		background: var(--color-main);
		color: var(--color-background);
		width: var(--space-brand);
		height: var(--space-brand);
		font-size: var(--font-size-m);
		display: grid;
		place-items: center;
	}
	.crumb {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-main);
	}
	.top-actions {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
	}
	.social {
		display: inline-flex;
		align-items: center;
		color: var(--color-text-muted);
	}
	.social:hover {
		color: var(--color-text);
	}
</style>
