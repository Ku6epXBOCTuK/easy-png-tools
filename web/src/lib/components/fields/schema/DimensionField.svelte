<script lang="ts">
	import { t } from "$lib/i18n/t";
	import {
		SIZE_PRESETS,
		type Dimension,
		type DimensionSpec,
		type FieldSpec,
	} from "$lib/registry-schema";
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: Dimension, axis?: "width" | "height" | "both") => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as DimensionSpec);
	const current = $derived.by(() => {
		const v = value as Partial<Dimension> | undefined;
		return {
			width:
				typeof v?.width === "number" && Number.isFinite(v.width)
					? v.width
					: sp.width,
			height:
				typeof v?.height === "number" && Number.isFinite(v.height)
					? v.height
					: sp.height,
		};
	});

	function setAxis(axis: "width" | "height", n: number) {
		onchange?.({ ...current, [axis]: n }, axis);
	}

	function applyPreset(n: number) {
		// Пресет задаёт обе оси явно — lockAspect его не пересчитывает.
		onchange?.({ width: n, height: n }, "both");
	}
</script>

<Control {label} caps>
	<div class="dimension-field">
		<label class="dimension-axis">
			<span>{t("ui.width")}</span>
			<input
				type="number"
				min={sp.min}
				max={sp.max}
				value={current.width}
				oninput={(e) =>
					setAxis("width", Number((e.target as HTMLInputElement).value))}
			/>
		</label>
		<label class="dimension-axis">
			<span>{t("ui.height")}</span>
			<input
				type="number"
				min={sp.min}
				max={sp.max}
				value={current.height}
				oninput={(e) =>
					setAxis("height", Number((e.target as HTMLInputElement).value))}
			/>
		</label>
	</div>
	{#if sp.presets}
		<div class="dimension-presets">
			{#each SIZE_PRESETS as n (n)}
				<ChipButton
					label={`${n}×${n}`}
					active={current.width === n && current.height === n}
					onclick={() => applyPreset(n)}
				/>
			{/each}
		</div>
	{/if}
</Control>

<style>
	.dimension-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.dimension-axis > span {
		display: block;
		margin-bottom: var(--space-m);
	}
	.dimension-axis input {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
	.dimension-presets {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		margin-top: var(--space-m);
	}
</style>
