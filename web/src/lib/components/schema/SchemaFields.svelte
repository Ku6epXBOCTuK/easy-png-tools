<script lang="ts">
	import type {
		Dimension,
		FieldSpec,
		FieldSpecKind,
		ToolSchema,
	} from "$lib/registry-schema";
	import { effectiveMax, resolveLayoutGroups } from "$lib/registry-schema";
	import { fieldLabel, groupLabel } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { RotateCcw } from "@lucide/svelte";
	import type { Component } from "svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import DimensionField from "$lib/components/fields/schema/DimensionField.svelte";
	import CheckboxControl from "$lib/components/fields/schema/CheckboxControl.svelte";
	import ColorControl from "$lib/components/fields/schema/ColorControl.svelte";
	import ColorPairControl from "$lib/components/fields/schema/ColorPairControl.svelte";
	import ColorsControl from "$lib/components/fields/schema/ColorsControl.svelte";
	import RangeControl from "$lib/components/fields/schema/RangeControl.svelte";
	import SelectControl from "$lib/components/fields/schema/SelectControl.svelte";
	import TextControl from "$lib/components/fields/schema/TextControl.svelte";
	import OffsetControl from "$lib/components/fields/schema/OffsetControl.svelte";
	import PositionControl from "$lib/components/fields/schema/PositionControl.svelte";
	import FontStyleControl from "$lib/components/fields/schema/FontStyleControl.svelte";
	import PlateControl from "$lib/components/fields/schema/PlateControl.svelte";
	import GradientControl from "$lib/components/fields/schema/GradientControl.svelte";

	interface FieldControlProps {
		label: string;
		value: unknown;
		spec: FieldSpec;
		toolId: string;
		fieldId: string;
		sourceDims?: Dimension;
		onchange?: (value: unknown, axis?: "width" | "height" | "both") => void;
	}

	const FIELDS: Record<FieldSpecKind, Component<FieldControlProps>> = {
		number: RangeControl,
		slider: RangeControl,
		color: ColorControl,
		"color-pair": ColorPairControl,
		colors: ColorsControl,
		select: SelectControl,
		checkbox: CheckboxControl,
		text: TextControl,
		dimension: DimensionField,
		offset: OffsetControl,
		position9: PositionControl,
		"font-style": FontStyleControl,
		plate: PlateControl,
		gradient: GradientControl,
	};

	interface Props {
		schema: ToolSchema<Record<string, unknown>>;
		values: Record<string, unknown>;
		toolId: string;
		/** Размеры входа шага: для maxFromSource-полей (crop и т.п.). */
		sourceDims?: Dimension;
		onchange: (
			id: string,
			value: unknown,
			axis?: "width" | "height" | "both",
		) => void;
		onreset: () => void;
	}
	let {
		schema,
		values,
		toolId,
		sourceDims = undefined,
		onchange,
		onreset,
	}: Props = $props();

	const layoutGroups = $derived(resolveLayoutGroups(schema));

	function effectiveSpec(spec: FieldSpec): FieldSpec {
		if (sourceDims && spec.kind === "number" && spec.maxFromSource) {
			return { ...spec, max: effectiveMax(spec, sourceDims) };
		}
		return spec;
	}
</script>

{#each layoutGroups as group (group.key)}
	{#if group.title}
		<span class="group-title">{groupLabel(group.title)}</span>
	{/if}
	<div
		class="group-fields"
		style:grid-template-columns={group.cols > 1
			? `repeat(${group.cols}, minmax(0, 1fr))`
			: undefined}
	>
		{#each group.fields as id (id)}
			{@const Control = FIELDS[schema.fields[id].spec.kind]}
			<Control
				label={fieldLabel(schema.fields[id], id)}
				value={values[id]}
				spec={effectiveSpec(schema.fields[id].spec)}
				{toolId}
				fieldId={id}
				{sourceDims}
				onchange={(v, axis) => onchange(id, v, axis)}
			/>
		{/each}
	</div>
{/each}

<div class="panel-foot">
	<Button
		icon={RotateCcw}
		label={t("ui.reset")}
		variant="clear"
		size="s"
		onclick={onreset}
	/>
</div>

<style>
	.group-title {
		display: block;
		margin-top: var(--space-l);
		margin-bottom: var(--space-s);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.group-title:first-child {
		margin-top: 0;
	}
	.group-fields {
		display: grid;
		grid-template-columns: 1fr;
		column-gap: var(--space-l);
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
</style>
