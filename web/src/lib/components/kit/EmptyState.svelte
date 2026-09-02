<script lang="ts">
	import type { Component, Snippet } from "svelte";
	import Icon from "./ui/Icon.svelte";

	interface Props {
		title: string;
		description?: string;
		icon?: Component<{ size?: number; class?: string }>;
		children?: Snippet;
	}
	let { title, description, icon, children }: Props = $props();
</script>

<div class="empty-state">
	{#if icon}<span class="empty-icon"><Icon {icon} size={28} /></span>{/if}
	<strong class="empty-title">{title}</strong>
	{#if description}<span class="empty-desc">{description}</span>{/if}
	{#if children}<div class="empty-action">{@render children()}</div>{/if}
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 2rem 1rem;
		text-align: center;
		color: var(--muted);
	}
	.empty-icon {
		color: var(--muted);
	}
	.empty-title {
		color: var(--foreground);
		font-size: 0.95rem;
	}
	.empty-desc {
		font-size: 0.8rem;
		max-width: 32ch;
	}
</style>
