<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		label: string;
		hint?: string;
		children: Snippet;
	}

	let { id, label, hint, children }: Props = $props();
</script>

<div class="field">
	<label class="text-caption text-muted" for={id}>{label}</label>
	{@render children()}
	{#if hint}
		<p class="hint text-caption text-muted">{hint}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-bottom: var(--space-3);
	}
</style>
