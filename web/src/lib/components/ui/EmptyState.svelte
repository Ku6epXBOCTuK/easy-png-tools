<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		hint?: string;
		children?: Snippet;
	}

	let { title, hint, children }: Props = $props();
</script>

<div class="empty panel">
	<p class="title">{title}</p>
	{#if hint}
		<p class="text-caption text-muted">{hint}</p>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		min-height: 8rem;
		padding: var(--space-4);
		text-align: center;
	}

	.title {
		font-weight: 600;
	}
</style>
