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
	.control-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font: 10px var(--font-mono);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	output {
		font: 11px var(--font-mono);
		color: var(--foreground);
	}
	input[type="range"] {
		width: 100%;
		accent-color: var(--blue);
	}
</style>
