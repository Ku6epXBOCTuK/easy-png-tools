<script lang="ts">
	import type { Component, Snippet } from "svelte";
	import Icon from "./Icon.svelte";

	interface Props {
		children: Snippet;
		onclick?: () => void;
		type?: "button" | "submit";
		variant?: "primary" | "ghost" | "accent" | "danger";
		icon?: Component<{ size?: number; class?: string }>;
		disabled?: boolean;
	}
	let {
		children,
		onclick,
		type = "button",
		variant = "primary",
		icon,
		disabled = false,
	}: Props = $props();
</script>

<button
	{type}
	class="btn btn--{variant}"
	{disabled}
	onclick={() => onclick?.()}
>
	{#if icon}<Icon {icon} size={14} />{/if}
	<span class="btn-label">{@render children()}</span>
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: transparent;
		color: var(--foreground);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.btn--primary {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.btn--ghost:hover:not(:disabled) {
		border-color: var(--blue);
	}
	.btn--accent {
		background: var(--cyan);
		color: #042;
		border-color: var(--cyan);
	}
	.btn--danger {
		background: var(--danger);
		color: #fff;
		border-color: var(--danger);
	}
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
