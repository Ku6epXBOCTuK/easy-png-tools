<script lang="ts">
	import ColorField from "$lib/components/kit/fields/ColorField.svelte";
	import NumberField from "$lib/components/kit/fields/NumberField.svelte";
	import SelectField from "$lib/components/kit/fields/SelectField.svelte";
	import SliderField from "$lib/components/kit/fields/SliderField.svelte";
	import TextField from "$lib/components/kit/fields/TextField.svelte";
	import ToggleRow from "$lib/components/kit/fields/ToggleRow.svelte";
	import type { ParamDef } from "$lib/registry";

	type ParamValue = string | number | boolean;

	interface Props {
		param: ParamDef;
		value: ParamValue;
		onInput: (value: ParamValue) => void;
	}

	let { param, value, onInput }: Props = $props();
</script>

{#if param.type === "color"}
	<ColorField
		label={param.label}
		value={value as string}
		oninput={(v) => onInput(v)}
	/>
{:else if param.type === "slider"}
	<SliderField
		label={param.label}
		value={value as number}
		min={param.min}
		max={param.max}
		step={param.step}
		oninput={(v) => onInput(v)}
	/>
{:else if param.type === "select"}
	<SelectField
		label={param.label}
		value={value as string}
		options={param.options}
		onchange={(v) => onInput(v)}
	/>
{:else if param.type === "checkbox"}
	<ToggleRow
		label={param.label}
		checked={value as boolean}
		onchange={(v) => onInput(v)}
	/>
{:else if param.type === "text"}
	<TextField
		label={param.label}
		value={value as string}
		placeholder={param.placeholder}
		oninput={(v) => onInput(v)}
	/>
{:else if param.type === "number"}
	<NumberField
		label={param.label}
		value={value as number}
		min={param.min}
		max={param.max}
		step={param.step}
		oninput={(v) => onInput(v)}
	/>
{/if}
