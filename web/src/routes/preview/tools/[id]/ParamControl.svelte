<script lang="ts">
	import type { ParamDef } from "$lib/registry";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import SelectField from "$lib/components/kit/SelectField.svelte";
	import ToggleRow from "$lib/components/kit/ToggleRow.svelte";
	import TextField from "$lib/components/kit/TextField.svelte";
	import NumberField from "$lib/components/kit/NumberField.svelte";

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
