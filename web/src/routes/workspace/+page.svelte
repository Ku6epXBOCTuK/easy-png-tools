<script lang="ts">
	import { clonePixelImage, type PixelImage } from '$lib/core/types';
	import { decodeFile, isSupportedImage, unsupportedImageMessage } from '$lib/core/io';
	import { getTool, PNG_OUTPUT, sanitizeParams } from '$lib/registry';
	import { createAutoRunner } from '$lib/tools/auto-run';
	import { createStep, type PipelineStep } from '$lib/tools/pipeline';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import SourceCard from '$lib/components/tool/SourceCard.svelte';
	import StepEditor from '$lib/components/workspace/StepEditor.svelte';
	import StepList from '$lib/components/workspace/StepList.svelte';
	import StepPicker from '$lib/components/workspace/StepPicker.svelte';

	type Status = 'idle' | 'loaded' | 'processing' | 'error';

	const runner = createAutoRunner();
	let hasLastRun = false;
	let lastRunSource: PixelImage | null = null;
	let lastRunStepsJson = '';

	let status = $state<Status>('idle');
	let source = $state<PixelImage | null>(null);
	let steps = $state<PipelineStep[]>([]);
	let selectedId = $state<string | null>(null);
	let previews = $state<(PixelImage | null)[]>([]);
	let errorText = $state('');

	let selectedIndex = $derived.by(() => {
		if (selectedId !== null) {
			const index = steps.findIndex((step) => step.id === selectedId);
			if (index >= 0) return index;
		}
		return steps.length - 1;
	});

	let shownResult = $derived.by(() => {
		if (!source) return null;
		if (previews.length === 0) return steps.length === 0 ? source : null;
		const idx = Math.min(Math.max(selectedIndex, 0), previews.length - 1);
		return previews[idx];
	});

	function addStep(toolId: string) {
		steps.push(createStep(toolId));
		selectedId = steps[steps.length - 1].id;
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const [moved] = steps.splice(index, 1);
		steps.splice(index - 1, 0, moved);
	}

	function moveDown(index: number) {
		if (index >= steps.length - 1) return;
		const [moved] = steps.splice(index, 1);
		steps.splice(index + 1, 0, moved);
	}

	function removeStep(index: number) {
		if (index < 0 || index >= steps.length) return;
		const removed = steps[index];
		steps.splice(index, 1);
		if (selectedId === removed.id) selectedId = null;
	}

	async function runChain() {
		if (!source) return;
		const token = runner.next();
		hasLastRun = true;
		lastRunSource = source;
		lastRunStepsJson = JSON.stringify(steps);
		status = 'processing';
		errorText = '';
		try {
			const collected: PixelImage[] = [];
			let current: PixelImage = clonePixelImage(source);
			for (let i = 0; i < steps.length; i++) {
				const step = steps[i];
				const tool = getTool(step.toolId);
				if (!tool?.run) continue;
				try {
					current = await tool.run(current, sanitizeParams(tool, step.values));
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					throw new Error(`Шаг ${i + 1} (${tool.title}): ${message}`);
				}
				if (!runner.isCurrent(token)) return;
				collected.push(current);
			}
			previews = collected;
			status = 'loaded';
		} catch (e) {
			if (!runner.isCurrent(token)) return;
			errorText = e instanceof Error ? e.message : String(e);
			status = 'loaded';
		}
	}

	$effect(() => {
		const stepsJson = JSON.stringify(steps);
		if (hasLastRun && source === lastRunSource && stepsJson === lastRunStepsJson) return;
		if (!source) return;
		return runner.schedule(() => void runChain());
	});

	function showError(message: string) {
		errorText = message;
	}

	function reset() {
		source = null;
		previews = [];
		status = 'idle';
		errorText = '';
	}

	async function handleFile(file: File) {
		if (!isSupportedImage(file)) {
			showError(unsupportedImageMessage(file));
			return;
		}
		try {
			source = await decodeFile(file);
		} catch (e) {
			showError(e instanceof Error ? e.message : String(e));
		}
	}

	function handlePaste(event: ClipboardEvent) {
		for (const item of event.clipboardData?.items ?? []) {
			if (!item.type.startsWith('image/')) continue;
			const file = item.getAsFile();
			if (!file) break;
			event.preventDefault();
			if (!isSupportedImage(file)) {
				showError(unsupportedImageMessage(file));
				break;
			}
			void handleFile(file);
			break;
		}
	}
</script>

<svelte:window onpaste={handlePaste} />

<section>
	<h1>Рабочая область</h1>
	<p class="description text-muted">
		Цепочка инструментов: результат каждого шага становится входом следующего.
	</p>

	{#if errorText}
		<div class="error-banner" role="alert">{errorText}</div>
	{/if}

	<div class="stage panel">
		<div class="cell">
			<SourceCard {source} onFile={handleFile} onError={showError} onReset={reset} />
		</div>

		<div class="cell middle">
			<h2 class="heading-section">Шаги</h2>
			<StepPicker onAdd={addStep} />
			<StepList
				{steps}
				selectedIndex={selectedIndex}
				onSelect={(index) => (selectedId = steps[index]?.id ?? null)}
				onMoveUp={moveUp}
				onMoveDown={moveDown}
				onRemove={removeStep}
			/>
			{#if selectedIndex >= 0 && steps[selectedIndex]}
				<StepEditor step={steps[selectedIndex]} />
			{/if}
		</div>

		<div class="cell">
			<h2 class="heading-section">Итог</h2>
			{#if !source}
				<div class="media">
					<EmptyState
						title="Итог появится здесь"
						hint="Загрузите изображение и соберите цепочку шагов"
					/>
				</div>
			{:else if status === 'processing' && !shownResult}
				<div class="media">
					<EmptyState title="Обработка…" hint="Выполняется цепочка шагов" />
				</div>
			{:else}
				<div class="media">
					<Preview image={shownResult} />
					{#if status === 'processing'}
						<span class="recalc" aria-live="polite">Пересчёт…</span>
					{/if}
				</div>
				<DownloadButton
					image={shownResult}
					format={PNG_OUTPUT}
					baseName="workspace"
					params={{}}
					onError={(e) => showError(e instanceof Error ? e.message : String(e))}
				/>
			{/if}
		</div>
	</div>
</section>

<style>
	h1 {
		margin-bottom: var(--space-1);
	}

	.description {
		max-width: 48rem;
		margin-bottom: var(--space-4);
	}

	.error-banner {
		margin-bottom: var(--space-3);
	}

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem) minmax(0, 1fr);
		gap: var(--space-4);
		padding: var(--space-4);
		align-items: start;
	}

	.cell {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.cell h2 {
		margin-bottom: var(--space-1);
	}

	.middle {
		position: sticky;
		top: var(--space-4);
	}

	.media {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 14rem;
		position: relative;
		width: 100%;
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

	@media (max-width: 64rem) {
		.stage {
			grid-template-columns: 1fr;
		}

		.middle {
			position: static;
		}
	}
</style>
