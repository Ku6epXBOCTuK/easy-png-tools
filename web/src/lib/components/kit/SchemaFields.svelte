<script lang="ts">
	import { RotateCcw } from "@lucide/svelte";
	import type { ToolSchema, Dimension } from "$lib/registry-schema";
	import DimensionField from "./fields/DimensionField.svelte";

	interface Props {
		schema: ToolSchema<Record<string, unknown>>;
		values: Record<string, unknown>;
		onchange: (id: string, value: unknown) => void;
		onreset: () => void;
	}
	let { schema, values, onchange, onreset }: Props = $props();

	function labelOf(id: string): string {
		return id
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/[_-]+/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

{#each Object.entries(schema.fields) as [id, field] (id)}
	{#if field.spec.kind === "number" || field.spec.kind === "slider"}
		<label class="control">
			<span>
				{labelOf(id)}
				<output>{String(values[id] ?? field.spec.default)}</output>
			</span>
			<input
				type="range"
				min={field.spec.min ?? 0}
				max={field.spec.max ?? 100}
				step={field.spec.step ?? 1}
				value={Number(values[id] ?? field.spec.default)}
				oninput={(e) =>
					onchange(id, Number((e.target as HTMLInputElement).value))}
			/>
		</label>
	{:else if field.spec.kind === "color"}
		<label class="control color-control">
			<span>{labelOf(id)}</span>
			<span class="color-row">
				<span
					class="swatch"
					style="background:{String(values[id] ?? field.spec.default)}"
				></span>
				<input
					type="color"
					value={String(values[id] ?? field.spec.default)}
					oninput={(e) => onchange(id, (e.target as HTMLInputElement).value)}
				/>
			</span>
		</label>
	{:else if field.spec.kind === "dimension"}
		<div class="control">
			<DimensionField
				label={labelOf(id)}
				value={(values[id] as Dimension) ?? { width: field.spec.width, height: field.spec.height }}
				spec={field.spec}
				oninput={(v) => onchange(id, v)}
			/>
		</div>
	{/if}
{/each}

<div class="panel-foot">
	<button class="reset-btn" onclick={onreset}>
		<RotateCcw size={14} /> Reset
	</button>
	<span class="auto-note"><i></i> updates automatically</span>
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
	.control > span {
		display: flex;
		justify-content: space-between;
	}
	.control output {
		color: var(--color-text);
	}
	input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
		color: var(--color-text);
	}
	.color-control > span:first-child {
		justify-content: flex-start;
	}
	.color-row {
		display: flex;
		align-items: center;
		gap: var(--space-m);
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	input[type="color"] {
		width: 100%;
		height: var(--space-xxl);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		background: var(--color-background);
		cursor: pointer;
	}
	.panel-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-m);
		margin-top: var(--space-xl);
		padding-top: var(--space-l);
		border-top: var(--size-border) solid var(--color-border);
	}
	.reset-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		background: none;
		border: none;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.reset-btn:hover {
		color: var(--color-text);
	}
	.auto-note i {
		width: var(--size-border-thick);
		height: var(--size-border-thick);
		border-radius: 50%;
		background: var(--color-success);
	}
</style>
