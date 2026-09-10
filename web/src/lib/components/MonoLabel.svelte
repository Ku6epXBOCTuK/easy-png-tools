<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		accent?: boolean;
		children?: Snippet;
	}

	let { accent = false, children }: Props = $props();
</script>

<span class="mono-label" class:accent>
	{#if children}
		{@render children()}
	{/if}
</span>

<style>
	.mono-label {
		font: normal var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
		line-height: normal;
	}

	.accent {
		color: var(--color-accent);
	}
</style>
