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
		gap: var(--space-m);
		padding: var(--space-xxxl) var(--space-xl);
		text-align: center;
		color: var(--color-text-muted);
	}
	.empty-icon {
		color: var(--color-text-muted);
	}
	.empty-title {
		color: var(--color-text);
		font-size: var(--font-size-m);
	}
	.empty-desc {
		font-size: var(--font-size-s);
		max-width: 32ch;
	}
</style>
