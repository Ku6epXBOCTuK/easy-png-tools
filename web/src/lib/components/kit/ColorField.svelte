<script lang="ts">
	import Field from "./Field.svelte";

	interface Props {
		label: string;
		value: string;
		oninput?: (value: string) => void;
	}
	let { label, value = $bindable(), oninput }: Props = $props();

	function handle(e: Event) {
		value = (e.target as HTMLInputElement).value;
		oninput?.(value);
	}
</script>

<Field {label}>
	<div class="color-field">
		<input type="color" class="color-swatch" {value} oninput={handle} />
		<input
			type="text"
			class="color-hex"
			{value}
			oninput={handle}
			spellcheck="false"
		/>
	</div>
</Field>

<style>
	.color-field {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.color-swatch {
		width: 2rem;
		height: 1.6rem;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: transparent;
		cursor: pointer;
	}
	.color-hex {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
		background: var(--background);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.3rem 0.5rem;
		text-transform: uppercase;
	}
</style>
