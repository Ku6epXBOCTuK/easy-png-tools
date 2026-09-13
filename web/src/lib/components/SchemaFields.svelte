<script lang="ts">
	import type {
		FieldSpec,
		FieldSpecKind,
		ToolSchema,
	} from "$lib/registry-schema";
	import { fieldLabel, groupLabel } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { RotateCcw } from "@lucide/svelte";
	import type { Component } from "svelte";
	import DimensionField from "./fields/DimensionField.svelte";
	import CheckboxControl from "./fields/schema/CheckboxControl.svelte";
	import ColorControl from "./fields/schema/ColorControl.svelte";
	import ColorPairControl from "./fields/schema/ColorPairControl.svelte";
	import ColorsControl from "./fields/schema/ColorsControl.svelte";
	import RangeControl from "./fields/schema/RangeControl.svelte";
	import SelectControl from "./fields/schema/SelectControl.svelte";
	import TextControl from "./fields/schema/TextControl.svelte";
	import OffsetControl from "./fields/schema/OffsetControl.svelte";
	import PositionControl from "./fields/schema/PositionControl.svelte";
	import FontStyleControl from "./fields/schema/FontStyleControl.svelte";
	import PlateControl from "./fields/schema/PlateControl.svelte";
	import GradientControl from "./fields/schema/GradientControl.svelte";

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
		onchange: (id: string, value: unknown) => void;
		onreset: () => void;
	}
	let { schema, values, onchange, onreset }: Props = $props();

	interface LayoutGroup {
		key: string;
		title?: string;
		cols: number;
		fields: string[];
	}

	const layoutGroups = $derived.by((): LayoutGroup[] => {
		const all = Object.keys(schema.fields);
		const groups = schema.layout?.groups ?? [];
		const used: Record<string, true> = {};
		const named = groups
			.map((g, gi) => {
				const fields = g.fields.filter((f) => {
					if (used[f] || !(f in schema.fields)) return false;
					used[f] = true;
					return true;
				});
				return {
					key: `${g.title ?? "group"}-${gi}`,
					title: g.title,
					cols: Math.max(1, Math.trunc(g.cols ?? 1)),
					fields,
				} satisfies LayoutGroup;
			})
			.filter((g) => g.fields.length > 0);
		const rest = all.filter((f) => !used[f]);
		if (rest.length > 0) {
			named.push({ key: "__default", title: undefined, cols: 1, fields: rest });
		}
		return named;
	});
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
				spec={schema.fields[id].spec}
				onchange={(v) => onchange(id, v)}
			/>
		{/each}
	</div>
{/each}

<div class="panel-foot">
	<button class="reset-btn" onclick={onreset}>
		<RotateCcw size={14} />
		{t("ui.reset")}
	</button>
	<span class="auto-note"><i></i> {t("ui.autoUpdate")}</span>
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
