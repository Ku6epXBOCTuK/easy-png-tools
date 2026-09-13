<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type {
		Dimension,
		DimensionSpec,
		FieldSpec,
	} from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: Dimension) => void;
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
		onchange?.({ ...current, [axis]: n });
	}
</script>

<div class="control dimension-control">
	<span class="dimension-label">{label}</span>
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
	.dimension-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
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
</style>
