<script lang="ts">
	import type { ColorSpec, FieldSpec } from "$lib/registry-schema";
	import ColorSwatchInput from "./ColorSwatchInput.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as ColorSpec);
	const current = $derived(typeof value === "string" ? value : sp.default);
</script>

<Control element="label" {label}>
	<ColorSwatchInput value={current} onchange={(v) => onchange?.(v)} />
</Control>
