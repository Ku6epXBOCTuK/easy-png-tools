<script lang="ts">
	import type { ParamDef } from '$lib/registry';
	import ParamForm from '../ParamForm.svelte';
	import Button from '../ui/Button.svelte';

	interface Props {
		params: ParamDef[];
		values: Record<string, any>;
		busy: boolean;
		onApply: () => void;
	}

	let { params, values = $bindable(), busy, onApply }: Props = $props();
</script>

<div class="panel root">
	<h2 class="heading-section">Параметры</h2>
	{#if params.length > 0}
		<ParamForm {params} bind:values />
		<Button onclick={onApply} {busy} busyText="Обработка…" fullWidth>Применить</Button>
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
