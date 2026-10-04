<script lang="ts">
	import type { FieldSpec, NumberSpec, SliderSpec } from "$lib/registry-schema";
	import { t } from "$lib/i18n/t";
	import { Minus, Plus, RotateCcw } from "@lucide/svelte";
	import IconButton from "$lib/components/ui/IconButton.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: number) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as NumberSpec | SliderSpec);
	const min = $derived(sp.min ?? 0);
	const max = $derived(sp.max ?? 100);
	const step = $derived(sp.step ?? 1);
	const current = $derived(
		typeof value === "number" && Number.isFinite(value) ? value : sp.default,
	);
	const atDefault = $derived(current === sp.default);
	const atMin = $derived(current <= min);
	const atMax = $derived(current >= max);

	function handle(e: Event) {
		const n = (e.target as HTMLInputElement).valueAsNumber;
		if (Number.isFinite(n)) onchange?.(n);
	}

	function stepBy(dir: 1 | -1) {
		onchange?.(Math.min(max, Math.max(min, current + dir * step)));
	}
</script>

<Control {label}>
	{#snippet trailing()}
		<span class="range-trailing">
			<IconButton
				icon={Minus}
				label={`${t("ui.decrease")} ${label}`}
				variant="clear"
				size="s"
				disabled={atMin}
				onclick={() => stepBy(-1)}
			/>
			<input
				class="range-number"
				aria-label={label}
				type="number"
				{min}
				{max}
				{step}
				value={current}
				oninput={handle}
			/>
			<IconButton
				icon={Plus}
				label={`${t("ui.increase")} ${label}`}
				variant="clear"
				size="s"
				disabled={atMax}
				onclick={() => stepBy(1)}
			/>
			<IconButton
				icon={RotateCcw}
				label={`${t("ui.reset")} ${label}`}
				variant="clear"
				size="s"
				disabled={atDefault}
				onclick={() => onchange?.(sp.default)}
			/>
		</span>
	{/snippet}
	<input
		aria-label={label}
		type="range"
		{min}
		{max}
		{step}
		value={current}
		oninput={handle}
	/>
</Control>

<style>
	.range-trailing {
		display: inline-flex;
		align-items: center;
		gap: var(--space-s);
	}
	.range-number {
		width: calc(var(--space-xxxl) * 3);
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-m) var(--font-mono);
		text-align: center;
		appearance: textfield;
	}
	.range-number::-webkit-outer-spin-button,
	.range-number::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
	input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
		color: var(--color-text);
	}
</style>
