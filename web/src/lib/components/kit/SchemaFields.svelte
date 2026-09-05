<script lang="ts">
	import type {
		FieldSpec,
		FieldSpecKind,
		ToolSchema,
	} from "$lib/registry-schema";
	import { RotateCcw } from "@lucide/svelte";
	import type { Component } from "svelte";
	import DimensionField from "./fields/DimensionField.svelte";
	import CheckboxControl from "./fields/schema/CheckboxControl.svelte";
	import ColorControl from "./fields/schema/ColorControl.svelte";
	import ColorPairControl from "./fields/schema/ColorPairControl.svelte";
	import RangeControl from "./fields/schema/RangeControl.svelte";
	import SelectControl from "./fields/schema/SelectControl.svelte";
	import TextControl from "./fields/schema/TextControl.svelte";
	import OffsetControl from "./fields/schema/OffsetControl.svelte";

	interface FieldControlProps {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: unknown) => void;
	}

	const FIELDS: Record<FieldSpecKind, Component<FieldControlProps>> = {
		number: RangeControl,
		slider: RangeControl,
		color: ColorControl,
		"color-pair": ColorPairControl,
		select: SelectControl,
		checkbox: CheckboxControl,
		text: TextControl,
		dimension: DimensionField,
		offset: OffsetControl,
	};

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
	{@const Control = FIELDS[field.spec.kind]}
	<Control
		label={labelOf(id)}
		value={values[id]}
		spec={field.spec}
		onchange={(v) => onchange(id, v)}
	/>
{/each}

<div class="panel-foot">
	<button class="reset-btn" onclick={onreset}>
		<RotateCcw size={14} /> Reset
	</button>
	<span class="auto-note"><i></i> updates automatically</span>
</div>

<style>
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
