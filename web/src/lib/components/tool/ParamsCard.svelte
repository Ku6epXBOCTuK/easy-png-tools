<script lang="ts">
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

<div class="root">
	{#if params.length > 0 || hasMask}
		<ParamForm
			{params}
			bind:values
			{pipetteTargetId}
			{onPipetteToggle}
			{hasMask}
			bind:showMask
		/>
	{:else}
		<p class="hint text-caption text-muted">
			У этого инструмента нет параметров — результат уже готов.
		</p>
	{/if}
</div>

<style>
	.root {
		padding: 0 var(--space-4) var(--space-3);
	}

	.hint {
		margin: 0;
	}
</style>
