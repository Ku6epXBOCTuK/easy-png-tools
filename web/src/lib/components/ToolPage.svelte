<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { decodeFile, isSupportedImage, unsupportedImageMessage } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import { defaultParams, sanitizeParams, type ToolEntry } from '$lib/registry';
	import ParamsCard from './tool/ParamsCard.svelte';
	import ResultCard from './tool/ResultCard.svelte';
	import SourceCard from './tool/SourceCard.svelte';

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

	let runToken = 0;
	let lastRunSource: PixelImage | null = null;
	let lastRunValuesJson = '';

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
		const token = ++runToken;
		lastRunSource = source;
		lastRunValuesJson = JSON.stringify(sanitized);
		try {
			const next = await tool.run(source, sanitized);
			if (token !== runToken) return;
			result = next;
			status = 'loaded';
		} catch (e) {
			if (token !== runToken) return;
			showError(e);
		}
	}

	$effect(() => {
		const valuesJson = JSON.stringify(sanitized);
		if (source === lastRunSource && valuesJson === lastRunValuesJson) return;
		if (!source || isInfo) return;
		const timer = setTimeout(() => void runTool(), 300);
		return () => clearTimeout(timer);
	});

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
		<div class="cell">
			<SourceCard
				{source}
				onFile={handleFile}
				onError={(message) => (errorText = message)}
				onReset={reset}
			/>
		</div>
		<div class="cell">
			<ResultCard
				{tool}
				sourceLoaded={!!source}
				{status}
				{result}
				{info}
				{isInfo}
				params={sanitized}
				onDownloadError={showError}
			/>
		</div>
	</div>

	{#if source && !isInfo}
		<ParamsCard params={tool.params} bind:values />
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

	.cell {
		min-width: 0;
		display: flex;
	}

	.cell + .cell {
		border-left: 1px solid var(--border);
		padding-left: var(--space-4);
	}

	@media (max-width: 48rem) {
		.stage {
			grid-template-columns: 1fr;
		}

		.cell + .cell {
			border-left: none;
			padding-left: 0;
			border-top: 1px solid var(--border);
			padding-top: var(--space-4);
		}
	}
</style>
