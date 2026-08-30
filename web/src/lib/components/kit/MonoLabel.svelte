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
		font-weight: 400;
		letter-spacing: 0.12em;
		color: var(--muted);
		line-height: normal;
	}

	.accent {
		color: var(--blue);
	}
</style>
