<script lang="ts">
	interface Props {
		value: string;
		type?: string;
		placeholder?: string;
		readonly?: boolean;
		label?: string;
		oninput?: (value: string) => void;
	}
	let {
		value = $bindable(),
		type = "text",
		placeholder = "",
		readonly = false,
		label,
		oninput,
	}: Props = $props();

	function handle(e: Event) {
		value = (e.target as HTMLInputElement).value;
		oninput?.(value);
	}
</script>

<input
	class="text-field"
	{type}
	{placeholder}
	{readonly}
	{value}
	aria-label={label}
	oninput={handle}
/>

<style>
	.text-field {
		width: 100%;
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		color: var(--color-text);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-m);
		padding: var(--space-s) var(--space-m);
	}
	.text-field:focus {
		outline: none;
		border-color: var(--color-main);
	}
</style>
