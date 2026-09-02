<script lang="ts">
	import Field from "./layout/Field.svelte";

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
		font-size: 11px;
		color: var(--foreground);
		background: var(--background);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.35rem 0.5rem;
	}
</style>
