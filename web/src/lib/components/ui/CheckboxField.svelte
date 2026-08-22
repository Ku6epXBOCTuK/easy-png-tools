<script lang="ts">
	interface Props {
		id: string;
		label: string;
		checked?: boolean;
		hint?: string;
	}

	let { id, label, checked = $bindable(false), hint }: Props = $props();
</script>

<div class="checkbox">
	<input id={id} type="checkbox" bind:checked />
	<label for={id}>{label}</label>
</div>
{#if hint}
	<p class="hint text-caption text-muted">{hint}</p>
{/if}

<style>
	.checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		cursor: pointer;
	}

	label {
		font-size: var(--text-m);
		cursor: pointer;
	}

	.hint {
		margin: calc(-1 * var(--space-3)) 0 var(--space-3);
	}
</style>
