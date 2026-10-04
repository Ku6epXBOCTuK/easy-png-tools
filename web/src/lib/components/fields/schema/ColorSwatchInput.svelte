<script lang="ts">
	interface Props {
		value: string;
		disabled?: boolean;
		onchange?: (value: string) => void;
	}
	let { value, disabled = false, onchange }: Props = $props();
</script>

<span class="swatch-field">
	<span class="swatch" style="background:{value}"></span>
	<input
		type="color"
		{value}
		{disabled}
		oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
	/>
</span>

<style>
	.swatch-field {
		display: grid;
		grid-template-columns: var(--space-xxl) 1fr;
		align-items: center;
		gap: var(--space-m);
	}

	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}

	input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		padding: 0;
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		cursor: pointer;
	}
</style>
