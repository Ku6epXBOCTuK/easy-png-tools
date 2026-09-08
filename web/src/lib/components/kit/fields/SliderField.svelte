<script lang="ts">
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

<div class="control-block">
	<label>{label} <output>{value}{suffix}</output></label>
	<input type="range" {min} {max} {step} {value} oninput={handle} />
</div>

<style>
	label {
		display: flex;
		justify-content: space-between;
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
		margin-bottom: var(--space-m);
	}
	output {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text);
	}
	input[type="range"] {
		color: var(--color-text);
		line-height: inherit;
		width: 100%;
		accent-color: var(--color-main);
	}
</style>
