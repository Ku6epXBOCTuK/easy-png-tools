<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type { ColorPair, ColorPairSpec } from "$lib/registry-schema";
	import ColorSwatchInput from "./ColorSwatchInput.svelte";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: ColorPairSpec;
		onchange?: (value: ColorPair) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived.by(() => {
		const v = value as Partial<ColorPair> | undefined;
		return {
			from: typeof v?.from === "string" ? v.from : sp.from,
			to: typeof v?.to === "string" ? v.to : sp.to,
		};
	});

	function setColor(axis: "from" | "to", hex: string) {
		onchange?.({ ...current, [axis]: hex });
	}
</script>

<Control {label} caps>
	<div class="pair-field">
		<label class="pair-axis">
			<ColorSwatchInput
				value={current.from}
				onchange={(v) => setColor("from", v)}
			/>
			<span class="axis-label">{t("ui.from")}</span>
		</label>
		<label class="pair-axis">
			<ColorSwatchInput
				value={current.to}
				onchange={(v) => setColor("to", v)}
			/>
			<span class="axis-label">{t("ui.to")}</span>
		</label>
	</div>
</Control>

<style>
	.pair-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.pair-axis {
		display: grid;
		gap: var(--space-m);
	}
</style>
