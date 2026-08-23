<script lang="ts">
	import CheckboxField from './ui/CheckboxField.svelte';
	import ColorField from './ui/ColorField.svelte';
	import SelectField from './ui/SelectField.svelte';
	import SliderField from './ui/SliderField.svelte';
	import TextField from './ui/TextField.svelte';
	import type { ParamDef } from '$lib/registry';

	interface Props {
		params: ParamDef[];
		values: Record<string, any>;
	}

	let { params, values = $bindable() }: Props = $props();
</script>

{#each params as param (param.id)}
	{#if param.type === 'checkbox'}
		<CheckboxField id={param.id} label={param.label} bind:checked={values[param.id]} />
	{:else if param.type === 'number'}
		<TextField
			id={param.id}
			label={param.label}
			type="number"
			min={param.min}
			max={param.max}
			step={param.step}
			bind:value={values[param.id]}
		/>
	{:else if param.type === 'slider'}
		<SliderField
			id={param.id}
			label={param.label}
			min={param.min}
			max={param.max}
			step={param.step}
			default={param.default}
			bind:value={values[param.id]}
		/>
	{:else if param.type === 'select'}
		<SelectField
			id={param.id}
			label={param.label}
			options={param.options}
			bind:value={values[param.id]}
		/>
	{:else if param.type === 'color'}
		<ColorField id={param.id} label={param.label} bind:value={values[param.id]} />
	{/if}
{/each}
