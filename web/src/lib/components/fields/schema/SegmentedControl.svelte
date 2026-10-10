<script lang="ts">
	import Control from "./Control.svelte";
	import Segmented from "$lib/components/ui/Segmented.svelte";
	import { optionLabel } from "$lib/i18n/schema-tool-strings";
	import type { SegmentedSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: SegmentedSpec;
		toolId: string;
		fieldId: string;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, toolId, fieldId, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived(
		typeof value === "string" && sp.options.some((o) => o.value === value)
			? value
			: sp.default,
	);
	const options = $derived(
		sp.options.map((o) => ({
			value: o.value,
			label: optionLabel(toolId, fieldId, o.value, o.label),
		})),
	);
</script>

<Control {label}>
	<Segmented {options} value={current} onchange={(v) => onchange?.(v)} />
</Control>
