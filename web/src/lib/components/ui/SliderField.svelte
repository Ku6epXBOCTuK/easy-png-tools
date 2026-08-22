<script lang="ts">
	import Field from './Field.svelte';

	interface Props {
		id: string;
		label: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		hint?: string;
	}

	let { id, label, value = $bindable(0), min, max, step, hint }: Props = $props();
</script>

<Field {id} {label} {hint}>
	<div class="row">
		<input id={id} type="range" min={min} max={max} step={step} bind:value />
		<output>{value}</output>
	</div>
</Field>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		max-width: var(--control-max-width);
	}

	input[type='range'] {
		flex: 1;
		accent-color: var(--accent);
	}

	output {
		min-width: 3ch;
		text-align: right;
		font-family: var(--font-mono);
		font-size: var(--text-s);
	}
</style>
