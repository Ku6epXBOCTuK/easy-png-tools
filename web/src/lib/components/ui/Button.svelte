<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		type?: 'button' | 'submit';
		disabled?: boolean;
		busy?: boolean;
		busyText?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		busy = false,
		busyText = '',
		onclick,
		children
	}: Props = $props();
</script>

<button
	{type}
	class={variant}
	aria-busy={busy}
	disabled={disabled || busy}
	onclick={onclick}
>
	{#if busy && busyText}
		{busyText}
	{:else}
		{@render children()}
	{/if}
</button>

<style>
	button {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-s);
		border: 1px solid transparent;
		font-weight: 600;
		font-size: var(--text-m);
		cursor: pointer;
		transition:
			background var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	button.primary {
		background: var(--accent);
		color: var(--accent-contrast);
	}

	button.primary:hover:not(:disabled) {
		background: var(--accent-hover);
	}

	button.secondary {
		background: var(--surface);
		color: var(--text);
		border-color: var(--border);
	}

	button.secondary:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
