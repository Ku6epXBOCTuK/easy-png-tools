<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type { FieldSpec, Plate, PlateSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: Plate) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as PlateSpec);
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

<div class="control plate-control">
	<span class="plate-label">{label}</span>
	<div class="plate-row {current.enabled ? '' : 'off'}">
		<label class="plate-enabled">
			<span>{t("ui.backingPlate")}</span>
			<input
				type="checkbox"
				checked={current.enabled}
				onchange={(e) => set("enabled", (e.target as HTMLInputElement).checked)}
			/>
		</label>
		<label class="plate-color">
			<span class="swatch" style="background:{current.color}"></span>
			<input
				type="color"
				value={current.color}
				disabled={!current.enabled}
				oninput={(e) => set("color", (e.target as HTMLInputElement).value)}
			/>
		</label>
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
</div>

<style>
	.control {
		display: grid;
		gap: var(--space-m);
		margin-bottom: var(--space-xl);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}
	.plate-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
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
	.plate-color {
		display: grid;
		grid-template-columns: var(--space-xxl) 1fr;
		align-items: center;
		gap: var(--space-m);
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	.plate-color input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		padding: 0;
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
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
