<script lang="ts">
	import Button from '../ui/Button.svelte';
	import { CATEGORIES } from '$lib/categories';
	import { TOOLS } from '$lib/registry';

	interface Props {
		onAdd: (toolId: string) => void;
	}

	let { onAdd }: Props = $props();

	const steppable = TOOLS.filter(
		(tool) => (tool.resultType ?? 'image') === 'image' && (!tool.sourceMode || tool.sourceMode === 'file')
	);

	let selected = $state(steppable[0]?.id ?? '');
</script>

<div class="picker">
	<select bind:value={selected} aria-label="Инструмент для нового шага">
		{#each CATEGORIES as category (category.id)}
			{@const categoryTools = steppable.filter((tool) => tool.category === category.id)}
			{#if categoryTools.length > 0}
				<optgroup label={category.label}>
					{#each categoryTools as tool (tool.id)}
						<option value={tool.id}>{tool.title}</option>
					{/each}
				</optgroup>
			{/if}
		{/each}
	</select>
	<Button variant="secondary" onclick={() => onAdd(selected)}>Добавить шаг</Button>
</div>

<style>
	.picker {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	select {
		flex: 1;
		min-width: 0;
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
	}
</style>
