<script lang="ts">
	import { outputOf, sanitizeParams, type ToolEntry } from '$lib/registry';
	import type { PixelImage } from '$lib/core/types';
	import DownloadButton from '../DownloadButton.svelte';
	import Button from '../ui/Button.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import ParamsCard from '../tool/ParamsCard.svelte';
	import Preview from '../Preview.svelte';
	import { TOOL_ICONS } from '$lib/tools/tool-icons';

	interface Props {
		index: number;
		tool: ToolEntry;
		values: Record<string, any>;
		input: PixelImage | null;
		result: PixelImage | null;
		busy: boolean;
		isLast: boolean;
		onRemove: () => void;
		onError: (e: unknown) => void;
		onAddStep: () => void;
		onRemoveChain: () => void;
	}

	let {
		index,
		tool,
		values = $bindable(),
		input,
		result,
		busy,
		isLast,
		onRemove,
		onError,
		onAddStep,
		onRemoveChain
	}: Props = $props();

	const format = $derived(outputOf(tool));
	const safeParams = $derived(sanitizeParams(tool, values));
	const StepIcon = $derived(TOOL_ICONS[tool.id]);
</script>

<div class="block">
	<div class="panel tool-stage">
		<span class="edge-legend step-legend">
			{#if StepIcon}
				<span class="step-icon" aria-hidden="true"><StepIcon size={14} strokeWidth={2} /></span>
			{/if}
			Шаг {index + 1}: {tool.title}
			<button
				type="button"
				class="remove"
				aria-label="Убрать шаг"
				title="Убрать шаг"
				onclick={onRemove}
			>
				✕
			</button>
		</span>

		<div class="cell">
			<span class="edge-legend cell-legend" aria-hidden="true">Вход</span>
			<div class="cell-media">
				<Preview image={input} />
			</div>
		</div>
		<div class="cell">
			<span class="edge-legend cell-legend" aria-hidden="true">Результат</span>
			{#if busy && !result}
				<div class="cell-media">
					<EmptyState title="Обработка…" hint="Выполняется шаг цепочки" />
				</div>
			{:else}
				<div class="cell-media">
					<Preview image={result} />
					{#if busy}
						<span class="recalc" aria-live="polite">Пересчёт…</span>
					{/if}
				</div>
				<div class="actions-row">
					<DownloadButton
						image={result}
						format={format}
						baseName="{index + 1}-{tool.id}"
						params={safeParams}
						{onError}
					/>
					<Button variant="secondary" fullWidth onclick={isLast ? onAddStep : onRemoveChain}>
						{isLast ? '⛓ Следующий инструмент' : '✂ Оборвать цепочку'}
					</Button>
				</div>
			{/if}
		</div>
	</div>

	{#if tool.params.length > 0}
		<div class="params-sep">
			<span class="edge-legend" aria-hidden="true">Параметры</span>
		</div>
		<ParamsCard params={tool.params} bind:values />
	{/if}
</div>

<style>
	.block {
		display: flex;
		flex-direction: column;
	}

	.tool-stage {
		position: relative;
		padding-top: var(--space-3);
		border-top: 0;
	}

	.step-legend {
		left: var(--space-3);
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text);
		font-weight: 600;
	}

	.step-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: var(--radius-s);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
		color: var(--accent);
	}

	.remove {
		width: 1.4rem;
		height: 1.4rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		color: var(--text-muted);
		line-height: 1;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.remove:hover {
		border-color: var(--danger);
		color: var(--danger);
	}

	.cell {
		position: relative;
	}

	.cell-legend {
		top: -0.9em;
		left: 50%;
		transform: translateX(-50%);
	}

	.recalc {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		padding: 2px var(--space-2);
		border-radius: var(--radius-s);
		background: color-mix(in srgb, var(--accent) 12%, var(--surface));
		color: var(--accent);
		font-size: var(--text-xs);
	}
</style>
