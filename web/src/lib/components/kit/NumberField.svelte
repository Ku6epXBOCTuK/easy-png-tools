<script lang="ts">
	import Field from "./layout/Field.svelte";

	interface Props {
		label: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		oninput?: (value: number) => void;
	}
	let { label, value = $bindable(), min, max, step, oninput }: Props = $props();

	function handle(e: Event) {
		value = Number((e.target as HTMLInputElement).value);
		oninput?.(value);
	}
</script>

<Field {label}>
	<input
		class="number-field"
		type="number"
		{min}
		{max}
		{step}
		{value}
		oninput={handle}
	/>
</Field>

<style>
	.number-field {
		width: 100%;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
		background: var(--background);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.35rem 0.5rem;
	}
	.number-field:focus {
		outline: none;
		border-color: var(--blue);
	}
</style>
