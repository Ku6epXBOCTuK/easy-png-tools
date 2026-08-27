<script lang="ts">
	import Field from "./Field.svelte";

	interface Props {
		label: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		suffix?: string;
		oninput?: (value: number) => void;
	}
	let {
		label,
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		suffix = "",
		oninput,
	}: Props = $props();

	function handle(e: Event) {
		value = Number((e.target as HTMLInputElement).value);
		oninput?.(value);
	}
</script>

<Field {label}>
	<div class="slider-field">
		<input type="range" {min} {max} {step} {value} oninput={handle} />
		<span class="slider-value">{value}{suffix}</span>
	</div>
</Field>

<style>
	.slider-field {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
	}
	input[type="range"] {
		flex: 1;
		accent-color: var(--blue);
	}
	.slider-value {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
		min-width: 4ch;
		text-align: right;
	}
</style>
