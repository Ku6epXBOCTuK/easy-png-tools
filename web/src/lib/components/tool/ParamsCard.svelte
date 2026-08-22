<script lang="ts">
	import ParamForm from '../ParamForm.svelte';
	import type { ParamDef } from '$lib/registry';

	interface Props {
		params: ParamDef[];
		values: Record<string, any>;
	}

	let { params, values = $bindable() }: Props = $props();
</script>

<div class="panel root">
	<h2 class="heading-section">Параметры</h2>
	{#if params.length > 0}
		<ParamForm {params} bind:values />
	{:else}
		<p class="hint text-caption text-muted">
			У этого инструмента нет параметров — результат уже готов.
		</p>
	{/if}
</div>

<style>
	.root {
		margin-top: var(--space-4);
		padding: var(--space-4);
	}

	h2 {
		margin-bottom: var(--space-2);
	}

	.hint {
		margin: 0;
	}
</style>
