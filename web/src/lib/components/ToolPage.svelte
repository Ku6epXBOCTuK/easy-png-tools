<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { decodeFile } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import { defaultParams, outputOf, sanitizeParams, type ToolEntry } from '$lib/registry';
	import Button from './ui/Button.svelte';
	import DownloadButton from './DownloadButton.svelte';
	import DropZone from './DropZone.svelte';
	import EmptyState from './ui/EmptyState.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import ParamForm from './ParamForm.svelte';
	import Preview from './Preview.svelte';

	let { tool }: { tool: ToolEntry } = $props();

	type Status = 'idle' | 'loaded' | 'processing' | 'error';

	let status = $state<Status>('idle');
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let info = $state<ImageInfo | null>(null);
	let errorText = $state('');
	let values = $state<Record<string, any>>({});

	const isInfo = $derived(tool.resultType === 'info');
	const sanitized = $derived(sanitizeParams(tool, values));

	async function handleFile(file: File) {
		errorText = '';
		status = 'processing';
		try {
			source = await decodeFile(file);
			values = defaultParams(tool);
			result = null;
			info = isInfo ? imageInfo(source) : null;
			if (isInfo) {
				status = 'loaded';
			} else {
				await runTool();
			}
		} catch (e) {
			showError(e);
		}
	}

	async function runTool() {
		if (!source || isInfo) return;
		try {
			result = await tool.run(source, sanitized);
			status = 'loaded';
		} catch (e) {
			showError(e);
		}
	}

	function apply() {
		if (!source || isInfo || status === 'processing') return;
		errorText = '';
		status = 'processing';
		runTool();
	}

	function showError(e: unknown) {
		status = source ? 'loaded' : 'idle';
		errorText = e instanceof Error ? e.message : String(e);
	}

	function reset() {
		source = null;
		result = null;
		info = null;
		errorText = '';
		status = 'idle';
		values = defaultParams(tool);
	}
</script>

<section>
	<h1>{tool.title}</h1>
	<p class="description text-muted">{tool.description}</p>

	{#if errorText}
		<div class="error-banner" role="alert">{errorText}</div>
	{/if}

	{#if !source}
		<DropZone onFile={handleFile} onError={(message) => (errorText = message)} />
	{:else}
		<div class="layout">
			<div class="result-col">
				<h2 class="heading-section">{isInfo ? 'Изображение' : 'Результат'}</h2>
				{#if status === 'processing' && !result}
					<EmptyState title="Обработка…" hint="Изображение обрабатывается, это займёт немного времени" />
				{:else}
					<Preview image={isInfo ? source : result} />
				{/if}
				{#if isInfo && info}
					<InfoPanel {info} />
				{/if}
				<div class="reset-row">
					<Button variant="secondary" onclick={reset}>Загрузить другое изображение</Button>
				</div>
			</div>

			{#if !isInfo}
				<div class="params-col">
					<h2 class="heading-section">Параметры</h2>
					{#if tool.params.length > 0}
						<ParamForm params={tool.params} bind:values />
						<Button
							onclick={apply}
							busy={status === 'processing'}
							busyText="Обработка…"
							fullWidth
						>
							Применить
						</Button>
					{:else}
						<p class="hint text-caption text-muted">
							У этого инструмента нет параметров — результат уже готов.
						</p>
					{/if}
					<div class="download-row">
						<DownloadButton
							image={result}
							format={outputOf(tool)}
							baseName={tool.id}
							params={sanitized}
							onError={showError}
						/>
					</div>
				</div>
			{/if}
		</div>
	{/if}
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

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 20rem);
		gap: var(--space-5);
		align-items: start;
	}

	@media (max-width: 48rem) {
		.layout {
			grid-template-columns: 1fr;
		}
	}

	.result-col h2,
	.params-col h2 {
		margin-bottom: var(--space-2);
	}

	.reset-row {
		margin-top: var(--space-3);
	}

	.download-row {
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: 1px solid var(--border);
	}

	.hint {
		margin-bottom: var(--space-3);
	}
</style>
