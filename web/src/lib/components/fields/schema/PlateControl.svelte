<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type { Plate, PlateSpec } from "$lib/registry-schema";
	import ColorSwatchInput from "./ColorSwatchInput.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: PlateSpec;
		onchange?: (value: Plate) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived.by(() => {
		const v = value as Partial<Plate> | undefined;
		return {
			enabled: typeof v?.enabled === "boolean" ? v.enabled : sp.enabled,
			color: typeof v?.color === "string" ? v.color : sp.color,
			opacity:
				typeof v?.opacity === "number" && Number.isFinite(v.opacity)
					? v.opacity
					: sp.opacity,
		};
	});

	function set<K extends keyof Plate>(key: K, val: Plate[K]) {
		onchange?.({ ...current, [key]: val });
	}
</script>

<Control {label} caps>
	<div class="plate-row {current.enabled ? '' : 'off'}">
		<label class="plate-enabled">
			<span>{t("ui.backingPlate")}</span>
			<input
				type="checkbox"
				checked={current.enabled}
				onchange={(e) => set("enabled", (e.target as HTMLInputElement).checked)}
			/>
		</label>
		<ColorSwatchInput
			value={current.color}
			disabled={!current.enabled}
			onchange={(v) => set("color", v)}
		/>
		<label class="plate-opacity">
			<span>
				{t("ui.opacity")}
				<output>{current.opacity}%</output>
			</span>
			<input
				type="range"
				min="0"
				max="100"
				step="5"
				value={current.opacity}
				disabled={!current.enabled}
				oninput={(e) =>
					set("opacity", Number((e.target as HTMLInputElement).value))}
			/>
		</label>
	</div>
</Control>

<style>
	.plate-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m) var(--space-l);
	}
	.plate-row.off {
		opacity: 0.55;
	}
	.plate-enabled {
		display: flex;
		justify-content: space-between;
		align-items: center;
		grid-column: 1 / -1;
	}
	.plate-enabled input[type="checkbox"] {
		width: var(--space-xl);
		height: var(--space-xl);
		accent-color: var(--color-main);
	}
	.plate-opacity {
		display: grid;
		gap: var(--space-m);
	}
	.plate-opacity > span {
		display: flex;
		justify-content: space-between;
	}
	.plate-opacity output {
		color: var(--color-text);
	}
	.plate-opacity input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
		color: var(--color-text);
	}
</style>
