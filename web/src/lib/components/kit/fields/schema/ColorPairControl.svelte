<script lang="ts">
	import type {
		ColorPair,
		ColorPairSpec,
		FieldSpec,
	} from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: ColorPair) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as ColorPairSpec);
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

<div class="control color-pair-control">
	<span class="pair-label">{label}</span>
	<div class="pair-field">
		<label class="pair-axis">
			<span class="swatch" style="background:{current.from}"></span>
			<input
				type="color"
				value={current.from}
				oninput={(e) => setColor("from", (e.target as HTMLInputElement).value)}
			/>
			<span class="axis-label">From</span>
		</label>
		<label class="pair-axis">
			<span class="swatch" style="background:{current.to}"></span>
			<input
				type="color"
				value={current.to}
				oninput={(e) => setColor("to", (e.target as HTMLInputElement).value)}
			/>
			<span class="axis-label">To</span>
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
	.pair-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.pair-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.pair-axis {
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
	.pair-axis input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		background: var(--color-background);
		cursor: pointer;
	}
	.axis-label {
		grid-column: 1 / -1;
	}
</style>
