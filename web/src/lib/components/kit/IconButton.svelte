<script lang="ts">
	import type { Component } from "svelte";
	import Icon from "./Icon.svelte";

	interface Props {
		icon: Component<{ size?: number; class?: string }>;
		label: string;
		onclick?: () => void;
		variant?: "ghost" | "solid" | "accent" | "bare";
		size?: number;
		disabled?: boolean;
	}

	let {
		icon,
		label,
		onclick,
		variant = "ghost",
		size = 16,
		disabled = false,
	}: Props = $props();
</script>

<button
	type="button"
	class="icon-btn icon-btn--{variant}"
	aria-label={label}
	{disabled}
	onclick={() => onclick?.()}
>
	<Icon {icon} {size} />
</button>

<style>
	.icon-btn {
		display: grid;
		align-items: center;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		font-size: inherit;
		line-height: inherit;
		border: 0;
		background: 0 0;
		border: 0;
		place-items: center;
		padding: 6px;
		display: grid;
	}
	.icon-btn:hover:not(:disabled) {
		color: var(--foreground);
		border-color: var(--blue);
	}
	.icon-btn--solid {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.icon-btn--accent {
		background: var(--cyan);
		color: #042;
		border-color: var(--cyan);
	}
	.icon-btn--bare {
		padding: 6px;
		border: 0;
		border-radius: 0;
		color: var(--muted);
	}
	.icon-btn--bare:hover:not(:disabled) {
		color: var(--foreground);
		border-color: transparent;
	}
	.icon-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon-btn--ghost {
		padding: 6px;
		border: 0;
		border-radius: 0;
		color: var(--muted);
	}
</style>
