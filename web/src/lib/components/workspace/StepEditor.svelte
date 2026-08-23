<script lang="ts">
	import ParamForm from '../ParamForm.svelte';
	import type { PipelineStep } from '$lib/tools/pipeline';
	import { getTool } from '$lib/registry';

	interface Props {
		step: PipelineStep;
	}

	let { step }: Props = $props();

	const tool = $derived(getTool(step.toolId));
</script>

{#if tool}
	<div class="editor panel">
		<h3 class="heading-section">{tool.title}</h3>
		<p class="description text-caption text-muted">{tool.description}</p>
		{#if tool.params.length > 0}
			<ParamForm params={tool.params} bind:values={step.values} />
		{:else}
			<p class="hint text-caption text-muted">У этого шага нет параметров.</p>
		{/if}
	</div>
{/if}

<style>
	.editor {
		padding: var(--space-3);
	}

	h3 {
		margin-bottom: var(--space-1);
		font-size: var(--text-m);
	}

	.description,
	.hint {
		margin: 0 0 var(--space-2);
	}
</style>
