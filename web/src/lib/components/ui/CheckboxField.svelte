<script lang="ts">
	interface Props {
		id: string;
		label: string;
		checked?: boolean;
		hint?: string;
	}

	let { id, label, checked = $bindable(false), hint }: Props = $props();
</script>

<div class="checkbox-row">
	<label class="checkbox" for={id}>
		<input id={id} type="checkbox" bind:checked />
		{label}
	</label>
	{#if hint}
		<p class="hint text-caption text-muted">{hint}</p>
	{/if}
</div>

<style>
	.checkbox-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: calc(var(--space-1) + 2px) 0;
		border-bottom: 1px dashed var(--border);
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		font-size: var(--text-caption, var(--text-s));
		color: var(--text-muted);
	}

	input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		cursor: pointer;
		accent-color: var(--accent);
	}

	label:hover {
		color: var(--text);
	}

	.hint {
		margin: 0;
		text-align: right;
	}
</style>
