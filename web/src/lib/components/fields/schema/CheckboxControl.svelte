<script lang="ts">
	import type { CheckboxSpec, FieldSpec } from "$lib/registry-schema";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: boolean) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as CheckboxSpec);
	const current = $derived(
		typeof value === "boolean" ? value : Boolean(sp.default),
	);
</script>

<Control element="label" {label} row>
	<input
		type="checkbox"
		class="checkbox-field"
		checked={current}
		onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
	/>
</Control>

<style>
	.checkbox-field {
		width: var(--space-xl);
		height: var(--space-xl);
		accent-color: var(--color-main);
	}
</style>
