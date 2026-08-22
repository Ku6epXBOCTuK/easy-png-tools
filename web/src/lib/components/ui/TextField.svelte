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
	}

	let { id, label, value = $bindable(''), type = 'text', min, max, step, hint }: Props = $props();
</script>

<Field {id} {label} {hint}>
	<input class="control" {id} {type} min={min} max={max} step={step} bind:value />
</Field>
