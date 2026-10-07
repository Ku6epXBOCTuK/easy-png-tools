<script lang="ts">
	import { resolve } from "$app/paths";
	import { ArrowUpRight, Star } from "@lucide/svelte";
	import type { Component } from "svelte";
	import Icon from "$lib/components/ui/Icon.svelte";
	import { isFav, toggleFav } from "$lib/favorites.svelte";
	import { t } from "$lib/i18n/t";

	interface Props {
		title: string;
		slug: string;
		description?: string;
		index?: number;
		icon?: Component<{ size?: number; class?: string }>;
	}
	let { title, slug, description, index, icon }: Props = $props();
</script>

<a class="tool-card" href={resolve("/tools/[slug]", { slug })}>
	{#if icon}<span class="tool-icon"><Icon {icon} size={19} /></span>{/if}
	<span class="tool-copy">
		<strong>{title}</strong>
		{#if description}<span>{description}</span>{/if}
	</span>
	<button
		type="button"
		class="tool-fav"
		class:active={isFav(slug)}
		aria-label={isFav(slug) ? t("ui.removeFav") : t("ui.addFav")}
		aria-pressed={isFav(slug)}
		onclick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			toggleFav(slug);
		}}
	>
		<Star size={15} fill={isFav(slug) ? "currentColor" : "none"} />
	</button>
	<span class="tool-index">
		{index !== undefined ? index.toString().padStart(2, "0") : ""}
	</span>
	<ArrowUpRight class="tool-arrow" size={16} />
</a>

<style>
	.tool-card {
		display: grid;
		grid-template-columns:
			var(--size-tool-icon) minmax(0, 1fr) var(--space-xxl)
			var(--space-xxl) var(--size-tool-arrow);
		align-items: center;
		gap: var(--space-l);
		min-height: var(--size-tool-min-height);
		padding: var(--space-xl);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
		color: var(--color-text);
		text-decoration: none;
	}
	.tool-card:hover {
		border-color: var(--color-main);
	}
	.tool-icon {
		width: var(--size-tool-icon);
		height: var(--size-tool-icon);
		display: grid;
		place-items: center;
		background: var(--color-main-soft);
		color: var(--color-main);
		border-radius: var(--radius-m);
	}
	.tool-fav {
		display: grid;
		place-items: center;
		padding: var(--space-s);
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.tool-fav:hover,
	.tool-fav.active {
		color: var(--color-warning);
	}
	.tool-copy {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		min-width: 0;
	}
	.tool-copy strong {
		font: 600 var(--font-size-s) var(--font-mono);
		color: var(--color-text);
	}
	.tool-copy span {
		font: var(--font-size-s)/1.5 var(--font-mono);
		color: var(--color-text-muted);
	}
	.tool-index {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		align-self: start;
	}
</style>
