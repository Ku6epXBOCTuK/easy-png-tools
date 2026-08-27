<script lang="ts">
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
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="tool-card" {href}>
	{#if icon}<span class="tool-icon"><Icon {icon} size={18} /></span>{/if}
	<span class="tool-index">
		{index !== undefined ? index.toString().padStart(2, "0") : ""}
	</span>
	<span class="tool-copy">
		<span class="tool-title">{title}</span>
		{#if description}<span class="tool-desc">{description}</span>{/if}
	</span>
	<span class="tool-arrow"><ArrowUpRight size={16} /></span>
</a>

<style>
	.tool-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
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
		color: var(--blue);
		display: inline-flex;
	}
	.tool-index {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted);
	}
	.tool-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
	}
	.tool-title {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.tool-desc {
		font-size: 0.8rem;
		color: var(--muted);
	}
	.tool-arrow {
		color: var(--muted);
	}
	.tool-card:hover .tool-arrow {
		color: var(--blue);
	}
</style>
