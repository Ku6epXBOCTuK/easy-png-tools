<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { decodeFile } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import { defaultParams, outputOf, type ToolEntry } from '$lib/registry';
	import DownloadButton from './DownloadButton.svelte';
	import DropZone from './DropZone.svelte';
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
				await apply();
			}
		} catch (e) {
			showError(e);
		}
	}

	async function apply() {
		if (!source || isInfo || status === 'processing') return;
		errorText = '';
		status = 'processing';
		try {
			result = await tool.run(source, values);
			status = 'loaded';
		} catch (e) {
			showError(e);
		}
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
	<p class="description">{tool.description}</p>

	{#if errorText}
		<div class="error" role="alert">{errorText}</div>
	{/if}

	{#if !source}
		<DropZone onFile={handleFile} onError={(message) => (errorText = message)} />
	{:else}
		<div class="layout">
			<div class="result-col">
				<h2>{isInfo ? 'Изображение' : 'Результат'}</h2>
				{#if status === 'processing' && !result}
					<p class="hint">Обработка…</p>
				{:else}
					<Preview image={isInfo ? source : result} />
				{/if}
				{#if isInfo && info}
					<InfoPanel {info} />
				{/if}
				<button class="secondary" onclick={reset}>Загрузить другое изображение</button>
			</div>

			{#if !isInfo}
				<div class="params-col">
					<h2>Параметры</h2>
					{#if tool.params.length > 0}
						<ParamForm params={tool.params} bind:values />
						<button class="primary" onclick={apply} disabled={status === 'processing'}>
							{status === 'processing' ? 'Обработка…' : 'Применить'}
						</button>
					{:else}
						<p class="hint">У этого инструмента нет параметров — результат уже готов.</p>
					{/if}
					<div class="download-row">
						<DownloadButton
							image={result}
							format={outputOf(tool)}
							baseName={tool.id}
							params={values}
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
		color: var(--text-muted);
		max-width: 48rem;
		margin-bottom: var(--space-4);
	}

	.error {
		padding: var(--space-2) var(--space-3);
		margin-bottom: var(--space-3);
		border: 1px solid #e5484d;
		border-radius: var(--radius-s);
		background: color-mix(in srgb, #e5484d 8%, var(--surface));
		color: #b3261e;
		font-size: 0.9rem;
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
		font-size: 1rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.result-col button.secondary {
		margin-top: var(--space-3);
	}

	.params-col button.primary {
		width: 100%;
	}

	.download-row {
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: 1px solid var(--border);
	}

	.download-row :global(button) {
		width: 100%;
	}

	.hint {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: var(--space-3);
	}
</style>
