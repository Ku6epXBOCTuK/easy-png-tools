<script lang="ts">
	import type { Component } from "svelte";
	import Icon from "./Icon.svelte";

	interface Props {
		icon: Component<{ size?: number; class?: string }>;
		label: string;
		onclick?: () => void;
		variant?: "ghost" | "solid" | "accent";
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: transparent;
		color: var(--muted);
		cursor: pointer;
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
	.icon-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
