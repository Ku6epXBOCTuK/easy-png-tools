<script lang="ts">
	import type { PipelineStep } from '$lib/tools/pipeline';
	import { getTool } from '$lib/registry';

	interface Props {
		steps: PipelineStep[];
		selectedIndex: number;
		onSelect: (index: number) => void;
		onMoveUp: (index: number) => void;
		onMoveDown: (index: number) => void;
		onRemove: (index: number) => void;
	}

	let { steps, selectedIndex, onSelect, onMoveUp, onMoveDown, onRemove }: Props = $props();

	function toolTitle(step: PipelineStep): string {
		return getTool(step.toolId)?.title ?? step.toolId;
	}
</script>

{#if steps.length === 0}
	<p class="empty text-caption text-muted">Цепочка пуста — добавьте первый инструмент.</p>
{:else}
	<ol>
		{#each steps as step, index (step.id)}
			<li>
				<button type="button" class="label" class:selected={index === selectedIndex} onclick={() => onSelect(index)}>
					<span class="num">{index + 1}</span>
					{toolTitle(step)}
				</button>
				<span class="controls">
					<button type="button" aria-label="Выше" disabled={index === 0} onclick={() => onMoveUp(index)}>↑</button>
					<button
						type="button"
						aria-label="Ниже"
						disabled={index === steps.length - 1}
						onclick={() => onMoveDown(index)}
					>↓</button>
					<button type="button" class="remove" aria-label="Удалить шаг" onclick={() => onRemove(index)}>✕</button>
				</span>
			</li>
		{/each}
	</ol>
{/if}

<style>
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	li {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.label {
		flex: 1;
		min-width: 0;
		text-align: left;
		padding: var(--space-1) var(--space-2);
		border: 1px solid transparent;
		border-radius: var(--radius-s);
		background: none;
		color: var(--text);
		cursor: pointer;
		font-size: var(--text-m);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.label:hover,
	.label.selected {
		background: color-mix(in srgb, var(--accent) 8%, var(--surface));
		border-color: var(--border);
	}

	.num {
		display: inline-block;
		min-width: 1.4ch;
		margin-right: var(--space-1);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.controls {
		display: flex;
		gap: 2px;
	}

	.controls button {
		width: 1.6rem;
		height: 1.6rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		color: var(--text-muted);
		line-height: 1;
		cursor: pointer;
	}

	.controls button:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}

	.controls .remove:hover:not(:disabled) {
		border-color: var(--danger);
		color: var(--danger);
	}

	.controls button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.empty {
		margin: 0;
	}
</style>
