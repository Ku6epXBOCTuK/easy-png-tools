<script lang="ts">
	import { outputOf, sanitizeParams, type ToolEntry } from '$lib/registry';
	import type { PixelImage } from '$lib/core/types';
	import DownloadButton from '../DownloadButton.svelte';
	import Button from '../ui/Button.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import ParamsCard from '../tool/ParamsCard.svelte';
	import Preview from '../Preview.svelte';

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
</script>

<div class="block">
	<header>
		<h3 class="heading-section">Шаг {index + 1}: {tool.title}</h3>
		<button
			type="button"
			class="remove"
			aria-label="Убрать шаг"
			title="Убрать шаг"
			onclick={onRemove}
		>
			✕
		</button>
	</header>

	<div class="tool-stage panel">
		<div class="cell">
			<h4 class="heading-section">Вход</h4>
			<div class="cell-media">
				<Preview image={input} />
			</div>
		</div>
		<div class="cell">
			<h4 class="heading-section">Результат</h4>
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

	<ParamsCard params={tool.params} bind:values />
</div>

<style>
	.block {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	h3 {
		margin: 0;
	}

	.remove {
		width: 1.6rem;
		height: 1.6rem;
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

	h4 {
		margin-bottom: var(--space-1);
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
