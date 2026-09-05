<script lang="ts">
	import type { FieldSpec, SelectSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as SelectSpec);
	const current = $derived(
		typeof value === "string" && sp.options.some((o) => o.value === value)
			? value
			: sp.default,
	);
</script>

<label class="control">
	<span>{label}</span>
	<select
		class="select-field"
		value={current}
		oninput={(e) => onchange?.((e.target as HTMLSelectElement).value)}
	>
		{#each sp.options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
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
