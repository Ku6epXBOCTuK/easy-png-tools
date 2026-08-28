<script lang="ts">
	import type { Snippet } from "svelte";

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
	<div class="control-slot">
		{@render children()}
		{#if hint}
			<p class="hint text-caption text-muted">{hint}</p>
		{/if}
	</div>
</div>

<style>
	.field {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: calc(var(--space-1) + 2px) 0;
		border-bottom: 1px dashed var(--border);
	}

	label {
		flex: none;
		max-width: 45%;
		text-align: left;
	}

	.control-slot {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-1);
	}

	.hint {
		margin: 0;
		align-self: flex-end;
		text-align: right;
	}
</style>
