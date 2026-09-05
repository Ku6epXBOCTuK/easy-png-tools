<script lang="ts">
	import type { Dimension, DimensionSpec } from "$lib/registry-schema";
	import NumberField from "./NumberField.svelte";

	interface Props {
		label: string;
		value: Dimension;
		spec: DimensionSpec;
		oninput?: (value: Dimension) => void;
	}
	let { label, value = $bindable(), spec, oninput }: Props = $props();

	function setAxis(axis: "width" | "height", n: number) {
		value = { ...value, [axis]: n };
		oninput?.(value);
	}
</script>

<div class="dimension-field">
	<span class="dimension-label">{label}</span>
	<NumberField
		label="Width"
		value={value.width}
		min={spec.min}
		max={spec.max}
		oninput={(n) => setAxis("width", n)}
	/>
	<NumberField
		label="Height"
		value={value.height}
		min={spec.min}
		max={spec.max}
		oninput={(n) => setAxis("height", n)}
	/>
</div>

<style>
	.dimension-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.dimension-label {
		grid-column: 1 / -1;
		color: var(--foreground);
		font-size: 11px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}
</style>
