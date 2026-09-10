<script lang="ts">
	import type { FieldSpec, Offset, OffsetSpec } from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: Offset) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as OffsetSpec);
	const current = $derived.by(() => {
		const v = value as Partial<Offset> | undefined;
		return {
			x: typeof v?.x === "number" && Number.isFinite(v.x) ? v.x : sp.x,
			y: typeof v?.y === "number" && Number.isFinite(v.y) ? v.y : sp.y,
		};
	});

	function setAxis(axis: "x" | "y", n: number) {
		onchange?.({ ...current, [axis]: n });
	}
</script>

<div class="control offset-control">
	<span class="offset-label">{label}</span>
	<div class="offset-field">
		<label class="offset-axis">
			<span>X</span>
			<input
				type="number"
				min={sp.min}
				max={sp.max}
				value={current.x}
				oninput={(e) =>
					setAxis("x", Number((e.target as HTMLInputElement).value))}
			/>
		</label>
		<label class="offset-axis">
			<span>Y</span>
			<input
				type="number"
				min={sp.min}
				max={sp.max}
				value={current.y}
				oninput={(e) =>
					setAxis("y", Number((e.target as HTMLInputElement).value))}
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
	.offset-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.offset-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.offset-axis > span {
		display: block;
		margin-bottom: var(--space-m);
	}
	.offset-axis input {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
</style>
