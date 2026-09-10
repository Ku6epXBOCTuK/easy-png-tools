<script lang="ts">
	import type { FieldSpec, TextSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as TextSpec);
	const current = $derived(typeof value === "string" ? value : sp.default);
</script>

<label class="control">
	<span>{label}</span>
	<input
		class="text-field"
		type="text"
		value={current}
		placeholder={sp.placeholder}
		oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
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
	.text-field {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
</style>
