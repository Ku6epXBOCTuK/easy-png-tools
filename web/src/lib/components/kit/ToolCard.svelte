<script lang="ts">
	import { resolve } from "$app/paths";
	import { ArrowUpRight } from "@lucide/svelte";
	import type { Component } from "svelte";
	import Icon from "./ui/Icon.svelte";

	interface Props {
		title: string;
		id: string;
		description?: string;
		index?: number;
		icon?: Component<{ size?: number; class?: string }>;
	}
	let { title, id, description, index, icon }: Props = $props();
</script>

<a class="tool-card" href={resolve("/preview/tools/[id]", { id })}>
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
		grid-template-columns: var(--size-tool-icon) minmax(0, 1fr) var(
				--space-xxl
			) var(--size-tool-arrow);
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
