<script lang="ts">
	import AngleControl from "./AngleControl.svelte";
	import ColorSwatchInput from "./ColorSwatchInput.svelte";
	import Control from "./Control.svelte";
	import { t } from "$lib/i18n/t";
	import type { FieldSpec, Gradient, GradientSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: Gradient) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as GradientSpec);
	const current = $derived.by(() => {
		const v = value as Partial<Gradient> | undefined;
		return {
			from: typeof v?.from === "string" ? v.from : sp.from,
			to: typeof v?.to === "string" ? v.to : sp.to,
			angle:
				typeof v?.angle === "number" && Number.isFinite(v.angle)
					? v.angle
					: sp.angle,
		};
	});

	function set<K extends keyof Gradient>(key: K, val: Gradient[K]) {
		onchange?.({ ...current, [key]: val });
	}
</script>

<Control {label} caps>
	<div class="gradient-colors">
		<label class="color-field">
			<span>{t("ui.from")}</span>
			<ColorSwatchInput value={current.from} onchange={(v) => set("from", v)} />
		</label>
		<label class="color-field">
			<span>{t("ui.to")}</span>
			<ColorSwatchInput value={current.to} onchange={(v) => set("to", v)} />
		</label>
	</div>
	<AngleControl value={current.angle} onchange={(a) => set("angle", a)} />
</Control>

<style>
	.gradient-colors {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m) var(--space-l);
	}
	.color-field {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: var(--space-m);
	}
</style>
