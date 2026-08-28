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
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.2;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.accent {
		color: var(--blue);
	}
</style>
