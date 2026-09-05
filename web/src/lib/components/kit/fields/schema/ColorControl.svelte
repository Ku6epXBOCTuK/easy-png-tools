<script lang="ts">
	import type { ColorSpec, FieldSpec } from "$lib/registry-schema";

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

<label class="control color-control">
	<span>{label}</span>
	<span class="color-row">
		<span class="swatch" style="background:{current}"></span>
		<input
			type="color"
			value={current}
			oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
		/>
	</span>
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
	.color-control > span:first-child {
		justify-content: flex-start;
	}
	.color-row {
		display: flex;
		align-items: center;
		gap: var(--space-m);
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		background: var(--color-background);
		cursor: pointer;
	}
</style>
