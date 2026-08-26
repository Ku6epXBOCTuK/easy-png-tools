<script lang="ts">
	import Field from './Field.svelte';

	interface Props {
		id: string;
		label: string;
		value?: string | number;
		type?: 'number' | 'text';
		min?: number;
		max?: number;
		step?: number;
		hint?: string;
		placeholder?: string;
	}

	let { id, label, value = $bindable(''), type = 'text', min, max, step, hint, placeholder }: Props =
		$props();
</script>

<Field {id} {label} {hint}>
	<input class="control" {id} {type} min={min} max={max} step={step} {placeholder} bind:value />
</Field>

<style>
	input.control::placeholder {
		color: var(--text-muted);
		opacity: 0.7;
	}
</style>
