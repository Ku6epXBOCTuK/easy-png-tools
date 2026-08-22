<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { decodeFile, isSupportedImage, unsupportedImageMessage } from '$lib/core/io';
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

	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (!item.type.startsWith('image/')) continue;
			const file = item.getAsFile();
			if (file) {
				event.preventDefault();
				if (!isSupportedImage(file)) {
					errorText = unsupportedImageMessage(file);
					return;
				}
				handleFile(file);
			}
			return;
		}
	}
</script>

<svelte:window onpaste={handlePaste} />

<section>
	<h1>{tool.title}</h1>
	<p class="description text-muted">{tool.description}</p>

	{#if errorText}
		<div class="error-banner" role="alert">{errorText}</div>
	{/if}

	<div class="stage panel">
		<div class="side">
			<h2 class="heading-section">Исходник</h2>
			{#if !source}
				<DropZone onFile={handleFile} onError={(message) => (errorText = message)} />
			{:else}
				<div class="media">
					<Preview image={source} />
				</div>
				<Button variant="secondary" onclick={reset}>Заменить изображение</Button>
			{/if}
		</div>

		<div class="side">
			<h2 class="heading-section">{isInfo ? 'Сводка' : 'Результат'}</h2>
			{#if !source}
				<div class="media">
					<EmptyState
						title="Результат появится здесь"
						hint="Сначала загрузите исходное изображение слева"
					/>
				</div>
			{:else if !isInfo && status === 'processing' && !result}
				<div class="media">
					<EmptyState
						title="Обработка…"
						hint="Изображение обрабатывается, это займёт немного времени"
					/>
				</div>
			{:else if isInfo}
				<div class="media">
					{#if info}
						<InfoPanel {info} />
					{/if}
				</div>
			{:else}
				<div class="media">
					<Preview image={result} />
				</div>
				<DownloadButton
					image={result}
					format={outputOf(tool)}
					baseName={tool.id}
					params={sanitized}
					onError={showError}
				/>
			{/if}
		</div>
	</div>

	{#if source && !isInfo}
		<div class="params-card panel">
			<h2 class="heading-section">Параметры</h2>
			{#if tool.params.length > 0}
				<ParamForm params={tool.params} bind:values />
				<Button onclick={apply} busy={status === 'processing'} busyText="Обработка…" fullWidth>
					Применить
				</Button>
			{:else}
				<p class="hint text-caption text-muted">
					У этого инструмента нет параметров — результат уже готов.
				</p>
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

	.stage {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		padding: var(--space-4);
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
	}

	.side + .side {
		border-left: 1px solid var(--border);
		padding-left: var(--space-4);
	}

	.side h2 {
		margin-bottom: var(--space-1);
	}

	.media {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 16rem;
	}

	.params-card {
		margin-top: var(--space-4);
		padding: var(--space-4);
	}

	@media (max-width: 48rem) {
		.stage {
			grid-template-columns: 1fr;
		}

		.side + .side {
			border-left: none;
			padding-left: 0;
			border-top: 1px solid var(--border);
			padding-top: var(--space-4);
		}
	}

	.hint {
		margin-bottom: var(--space-3);
	}

	.hint {
		margin-bottom: var(--space-3);
	}
</style>
