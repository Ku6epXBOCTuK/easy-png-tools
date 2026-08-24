<script lang="ts">
	import CheckboxField from '../ui/CheckboxField.svelte';
	import ParamForm from '../ParamForm.svelte';
	import type { ParamDef } from '$lib/registry';

	interface Props {
		params: ParamDef[];
		values: Record<string, any>;
		pipetteTargetId?: string | null;
		onPipetteToggle?: (id: string) => void;
		hasMask?: boolean;
		showMask?: boolean;
	}

	let {
		params,
		values = $bindable(),
		pipetteTargetId = null,
		onPipetteToggle,
		hasMask = false,
		showMask = $bindable(false)
	}: Props = $props();
</script>

<div class="panel root">
	<h2 class="heading-section">Параметры</h2>
	{#if hasMask}
		<CheckboxField id="show-mask" label="Показать маску" bind:checked={showMask} />
	{/if}
	{#if params.length > 0}
		<ParamForm {params} bind:values {pipetteTargetId} {onPipetteToggle} />
	{:else if !hasMask}
		<p class="hint text-caption text-muted">
			У этого инструмента нет параметров — результат уже готов.
		</p>
	{/if}
</div>

<style>
	.root {
		padding: var(--space-4);
	}

	h2 {
		margin-bottom: var(--space-2);
	}

	.hint {
		margin: 0;
	}
</style>
