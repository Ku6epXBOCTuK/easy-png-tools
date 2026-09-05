<script lang="ts">
	import type { FieldSpec, NumberSpec, SliderSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: number) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as NumberSpec | SliderSpec);
	const current = $derived(
		typeof value === "number" && Number.isFinite(value) ? value : sp.default,
	);

	function handle(e: Event) {
		onchange?.(Number((e.target as HTMLInputElement).value));
	}
</script>

<label class="control">
	<span>
		{label}
		<output>{current}</output>
	</span>
	<input
		type="range"
		min={sp.min ?? 0}
		max={sp.max ?? 100}
		step={sp.step ?? 1}
		value={current}
		oninput={handle}
	/>
</label>

<style>
	.control {
		display: grid;
		gap: var(--space-m);
		margin-bottom: var(--space-xl);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}
	.control > span {
		display: flex;
		justify-content: space-between;
	}
	.control output {
		color: var(--color-text);
	}
	input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
		color: var(--color-text);
	}
</style>
