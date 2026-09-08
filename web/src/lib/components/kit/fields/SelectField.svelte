<script lang="ts">
	import Field from "./Field.svelte";

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		label: string;
		value: string;
		options: Option[];
		onchange?: (value: string) => void;
	}
	let { label, value = $bindable(), options, onchange }: Props = $props();

	function handle(e: Event) {
		value = (e.target as HTMLSelectElement).value;
		onchange?.(value);
	}
</script>

<Field {label}>
	<select class="select-field" {value} onchange={handle}>
		{#each options as opt (opt.value)}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</Field>

<style>
	.select-field {
		width: 100%;
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		color: var(--color-text);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-m);
		padding: var(--space-s) var(--space-m);
	}
</style>
