<script lang="ts">
	import CheckboxField from './ui/CheckboxField.svelte';
	import ColorField from './ui/ColorField.svelte';
	import SelectField from './ui/SelectField.svelte';
	import SliderField from './ui/SliderField.svelte';
	import TextField from './ui/TextField.svelte';
	import type { ParamDef, ToolEntry } from '$lib/registry';
	import { optionLabel, paramLabel } from '$lib/i18n/tool-strings';
	import { t } from '$lib/i18n/t';

	interface Props {
		tool: ToolEntry;
		params: ParamDef[];
		values: Record<string, any>;
		pipetteTargetId?: string | null;
		onPipetteToggle?: (id: string) => void;
		hasMask?: boolean;
		showMask?: boolean;
	}

	let {
		tool,
		params,
		values = $bindable(),
		pipetteTargetId = null,
		onPipetteToggle,
		hasMask = false,
		showMask = $bindable(false)
	}: Props = $props();
</script>

<div class="params-grid">
	{#if hasMask}
		<CheckboxField id="show-mask" label={t('ui.showMask')} bind:checked={showMask} />
	{/if}
	{#each params as param (param.id)}
		<div class="field">
			{#if param.type === 'checkbox'}
				<CheckboxField id={param.id} label={paramLabel(tool, param)} bind:checked={values[param.id]} />
			{:else if param.type === 'number'}
				<TextField
					id={param.id}
					label={paramLabel(tool, param)}
					type="number"
					min={param.min}
					max={param.max}
					step={param.step}
					bind:value={values[param.id]}
				/>
			{:else if param.type === 'slider'}
				<SliderField
					id={param.id}
					label={paramLabel(tool, param)}
					min={param.min}
					max={param.max}
					step={param.step}
					default={param.default}
					bind:value={values[param.id]}
				/>
			{:else if param.type === 'select'}
				<SelectField
					id={param.id}
					label={paramLabel(tool, param)}
					options={param.options.map((o) => ({
						value: o.value,
						label: optionLabel(tool, param, o.value)
					}))}
					bind:value={values[param.id]}
				/>
			{:else if param.type === 'color'}
				<ColorField
					id={param.id}
					label={paramLabel(tool, param)}
					bind:value={values[param.id]}
					pipetteActive={pipetteTargetId === param.id}
					onPipetteToggle={() => onPipetteToggle?.(param.id)}
				/>
			{/if}
		</div>
	{/each}
</div>

<style>
	.params-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: var(--space-5);
	}

	@media (min-width: 75rem) {
		.params-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 50rem) {
		.params-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
