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
		font-size: 11px;
		color: var(--foreground);
		background: var(--background);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.35rem 0.5rem;
	}
	.text-field:focus {
		outline: none;
		border-color: var(--blue);
	}
</style>
