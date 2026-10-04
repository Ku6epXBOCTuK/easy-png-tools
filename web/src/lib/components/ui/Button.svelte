<script lang="ts">
	import type { Component } from "svelte";
	import {
		ButtonVariantDefine,
		type ButtonVariant,
		type ButtonSize,
	} from "./define";
	import Icon from "./Icon.svelte";

	interface Props {
		label: string;
		ariaLabel?: string;
		onclick?: () => void;
		variant?: ButtonVariant;
		size?: ButtonSize;
		icon?: Component<{ size?: number; class?: string }>;
		disabled?: boolean;
		type?: "button" | "submit";
	}
	let {
		label,
		ariaLabel = label,
		onclick,
		variant = ButtonVariantDefine.PRIMARY,
		size = "m",
		icon,
		disabled = false,
		type = "button",
	}: Props = $props();
</script>

<button
	class="btn btn--{variant} btn--{size}"
	class:btn--icon={!label}
	{type}
	{disabled}
	aria-label={ariaLabel}
	onclick={() => onclick?.()}
>
	{#if icon}
		<Icon {icon} size={14} />
	{/if}
	{#if label}
		<span class="btn-label">{label}</span>
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-xl);
		border-color: var(--color-main);
		border-width: var(--size-border-thick);
		border-radius: var(--radius-s);
		font-size: var(--font-size-l);
		font-weight: bold;
		cursor: pointer;
		background: var(--color-main);
		color: var(--color-background);
	}

	.btn--s {
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border-width: var(--size-border);
		border-radius: var(--radius-m);
		font-size: var(--font-size-s);
		font-family: var(--font-mono);
		font-weight: normal;
	}

	.btn--s.btn--icon {
		padding: var(--space-s);
	}

	.btn--outline {
		background: transparent;
		color: var(--color-main-tint);
		border-color: var(--color-main-tint);
	}

	.btn--s.btn--outline {
		color: var(--color-text-muted);
		border-color: var(--color-border);
	}

	.btn--s.btn--outline:hover {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}

	.btn--accent {
		background: var(--color-accent);
		color: var(--color-background);
		border-color: var(--color-accent);
	}

	.btn--danger {
		background: var(--color-danger);
		color: var(--color-background);
		border-color: var(--color-danger);
	}

	.btn--clear {
		background: none;
		border-color: transparent;
		color: var(--color-text-muted);
	}

	.btn--clear:hover {
		color: var(--color-text);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
