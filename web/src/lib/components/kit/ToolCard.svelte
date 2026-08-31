<script lang="ts">
	import { resolve } from "$app/paths";
	import { ArrowUpRight } from "@lucide/svelte";
	import type { Component } from "svelte";
	import Icon from "./Icon.svelte";

	interface Props {
		title: string;
		href: string;
		description?: string;
		index?: number;
		icon?: Component<{ size?: number; class?: string }>;
	}
	let { title, href, description, index, icon }: Props = $props();

	let normalizedHref = $derived(href === "#" ? "/" : href);
</script>

<a class="tool-card" href={resolve(normalizedHref)}>
	{#if icon}<span class="tool-icon"><Icon {icon} size={19} /></span>{/if}
	<span class="tool-copy">
		<strong>{title}</strong>
		{#if description}<span>{description}</span>{/if}
	</span>
	<span class="tool-index">
		{index !== undefined ? index.toString().padStart(2, "0") : ""}
	</span>
	<ArrowUpRight class="tool-arrow" size={16} />
</a>

<style>
	.tool-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 24px 18px;
		align-items: center;
		gap: 14px;
		min-height: 106px;
		padding: 16px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--panel);
		color: var(--foreground);
		text-decoration: none;
	}
	.tool-card:hover {
		border-color: var(--blue);
	}
	.tool-icon {
		width: 42px;
		height: 42px;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--blue) 12%, transparent);
		color: var(--blue);
		border-radius: var(--radius);
	}
	.tool-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.tool-copy strong {
		font: 600 13px var(--font-mono);
		color: var(--foreground);
	}
	.tool-copy span {
		font: 12px/1.5 var(--font-mono);
		color: var(--muted);
	}
	.tool-index {
		font: 10px var(--font-mono);
		color: var(--muted);
		align-self: start;
	}
	.tool-arrow {
		color: var(--blue);
		opacity: 0;
		transition:
			opacity 0.12s ease,
			transform 0.12s ease;
	}
	.tool-card:hover .tool-arrow {
		opacity: 1;
		transform: translate(2px, -2px);
	}
</style>
