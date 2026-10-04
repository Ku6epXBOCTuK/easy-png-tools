<script lang="ts">
	import { optionLabel } from "$lib/i18n/schema-tool-strings";
	import type { FieldSpec, SelectSpec } from "$lib/registry-schema";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		toolId: string;
		fieldId: string;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, toolId, fieldId, onchange }: Props = $props();

	const sp = $derived(spec as SelectSpec);
	const current = $derived(
		typeof value === "string" && sp.options.some((o) => o.value === value)
			? value
			: sp.default,
	);
</script>

<Control element="label" {label}>
	<select
		class="select-field"
		value={current}
		oninput={(e) => onchange?.((e.target as HTMLSelectElement).value)}
	>
		{#each sp.options as option (option.value)}
			<option value={option.value}>
				{optionLabel(toolId, fieldId, option.value, option.label)}
			</option>
		{/each}
	</select>
</Control>

<style>
	.select-field {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
</style>
