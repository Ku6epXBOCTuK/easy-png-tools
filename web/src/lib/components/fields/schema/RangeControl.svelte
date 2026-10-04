<script lang="ts">
	import type { FieldSpec, NumberSpec, SliderSpec } from "$lib/registry-schema";
	import Control from "./Control.svelte";

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

<Control element="label" {label}>
	{#snippet trailing()}
		<output>{current}</output>
	{/snippet}
	<input
		aria-label={label}
		type="range"
		min={sp.min ?? 0}
		max={sp.max ?? 100}
		step={sp.step ?? 1}
		value={current}
		oninput={handle}
	/>
</Control>

<style>
	output {
		color: var(--color-text);
	}
	input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
		color: var(--color-text);
	}
</style>
