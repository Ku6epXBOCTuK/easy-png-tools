<script lang="ts">
	import type { TextSpec } from "$lib/registry-schema";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: TextSpec;
		onchange?: (value: string) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived(typeof value === "string" ? value : sp.default);
</script>

<Control element="label" {label}>
	<input
		class="text-field"
		type="text"
		value={current}
		placeholder={sp.placeholder}
		oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
	/>
</Control>

<style>
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
