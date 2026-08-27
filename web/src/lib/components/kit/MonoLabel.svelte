<script lang="ts">
	interface Props {
		accent?: boolean;
		children?: import('svelte').Snippet;
	}

	let { accent = false, children }: Props = $props();
</script>

<span class="mono-label" class:accent={accent}>
	{#if children}
		{@render children()}
	{/if}
</span>

<style>
	.mono-label {
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.2;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.accent {
		color: var(--blue);
	}
</style>
