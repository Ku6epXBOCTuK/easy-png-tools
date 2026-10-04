<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		element?: "div" | "label";
		caps?: boolean;
		row?: boolean;
		trailing?: Snippet;
		children: Snippet;
	}
	let {
		label,
		element = "div",
		caps = false,
		row = false,
		trailing,
		children,
	}: Props = $props();
</script>

<svelte:element this={element} class="control" class:control--row={row}>
	<span class="label" class:caps>
		{label}
		{#if trailing}{@render trailing()}{/if}
	</span>
	{@render children()}
</svelte:element>

<style>
	.control {
		display: grid;
		gap: var(--space-m);
		margin-bottom: var(--space-xl);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}

	.control--row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		display: flex;
		justify-content: space-between;
	}

	.caps {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
</style>
