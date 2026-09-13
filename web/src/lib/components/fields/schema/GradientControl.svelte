<script lang="ts">
	import AngleControl from "./AngleControl.svelte";
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

<div class="control gradient-control">
	<span class="gradient-label">{label}</span>
	<div class="gradient-colors">
		<label class="color-field">
			<span>{t("ui.from")}</span>
			<span class="swatch" style="background:{current.from}"></span>
			<input
				type="color"
				value={current.from}
				oninput={(e) => set("from", (e.target as HTMLInputElement).value)}
			/>
		</label>
		<label class="color-field">
			<span>{t("ui.to")}</span>
			<span class="swatch" style="background:{current.to}"></span>
			<input
				type="color"
				value={current.to}
				oninput={(e) => set("to", (e.target as HTMLInputElement).value)}
			/>
		</label>
	</div>
	<AngleControl value={current.angle} onchange={(a) => set("angle", a)} />
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
	.gradient-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.gradient-colors {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m) var(--space-l);
	}
	.color-field {
		display: grid;
		grid-template-columns: auto var(--space-xxl) 1fr;
		align-items: center;
		gap: var(--space-m);
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	.color-field input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		padding: 0;
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
	}
</style>
