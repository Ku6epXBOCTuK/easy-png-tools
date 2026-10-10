<script lang="ts">
	import type { ColorSpec } from "$lib/registry-schema";
	import ColorSwatchInput from "./ColorSwatchInput.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: ColorSpec;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived(typeof value === "string" ? value : sp.default);
</script>

<Control element="label" {label}>
	<ColorSwatchInput value={current} onchange={(v) => onchange?.(v)} />
</Control>
