<script lang="ts">
	import type { Component } from "svelte";
	import { ButtonVariantDefine, type ButtonVariant } from "../define";
	import Icon from "./Icon.svelte";

	interface Props {
		label: string;
		ariaLabel?: string;
		onclick?: () => void;
		variant?: ButtonVariant;
		icon?: Component<{ size?: number; class?: string }>;
		disabled?: boolean;
	}
	let {
		label,
		ariaLabel = label,
		onclick,
		variant = ButtonVariantDefine.PRIMARY,
		icon,
		disabled = false,
	}: Props = $props();
</script>

<button
	class="btn btn--{variant}"
	{disabled}
	aria-label={ariaLabel}
	onclick={() => onclick?.()}
>
	{#if icon}<Icon {icon} size={14} />{/if}
	<span class="btn-label">{label}</span>
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
		font-size: var(--font-button);
		font-weight: bold;
		cursor: pointer;
		background: var(--color-main);
		color: var(--color-background);
	}

	.btn--outline {
		background: transparent;
		color: var(--color-main-tint);
		border-color: var(--color-main-tint);
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

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
