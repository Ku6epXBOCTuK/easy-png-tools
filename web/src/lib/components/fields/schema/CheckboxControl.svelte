<script lang="ts">
	import type { CheckboxSpec, FieldSpec } from "$lib/registry-schema";

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

<label class="control checkbox-control">
	<span>{label}</span>
	<input
		type="checkbox"
		class="checkbox-field"
		checked={current}
		onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
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
	.checkbox-control {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.checkbox-field {
		width: var(--space-xl);
		height: var(--space-xl);
		accent-color: var(--color-main);
	}
</style>
