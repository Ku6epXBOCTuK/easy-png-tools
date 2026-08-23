<script lang="ts">
	import { imageInfo, type ImageInfo } from '$lib/core/analyze';
	import { decodeFile, isSupportedImage, unsupportedImageMessage } from '$lib/core/io';
	import type { PixelImage } from '$lib/core/types';
	import { defaultParams, sanitizeParams, type ToolEntry } from '$lib/registry';
	import ParamsCard from './tool/ParamsCard.svelte';
	import ResultCard from './tool/ResultCard.svelte';
	import SourceCard from './tool/SourceCard.svelte';
	import TextInputCard from './tool/TextInputCard.svelte';

	let { tool }: { tool: ToolEntry } = $props();

	type Status = 'idle' | 'loaded' | 'processing' | 'error';

	let status = $state<Status>('idle');
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let previewResult = $state<PixelImage | null>(null);
	let textResult = $state<string | null>(null);
	let showMask = $state(false);
	let info = $state<ImageInfo | null>(null);
	let errorText = $state('');
	let values = $state<Record<string, any>>({});

	const isInfo = $derived(tool.resultType === 'info');
	const isSourceless = $derived(tool.sourceMode === 'none');
	const isTextSource = $derived(tool.sourceMode === 'text');
	const sanitized = $derived(sanitizeParams(tool, values));

	let runToken = 0;
	let hasLastRun = false;
	let lastRunSource: PixelImage | null = null;
	let lastRunValuesJson = '';
	let pipetteTargetId = $state<string | null>(null);

	function handlePipetteToggle(id: string) {
		pipetteTargetId = pipetteTargetId === id ? null : id;
	}

	function handlePickColor(hex: string) {
		if (!pipetteTargetId) return;
		values[pipetteTargetId] = hex;
		pipetteTargetId = null;
	}

	async function handleFile(file: File) {
		errorText = '';
		status = 'processing';
		try {
			source = await decodeFile(file);
			values = defaultParams(tool);
			result = null;
			previewResult = null;
			showMask = false;
			pipetteTargetId = null;
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

	async function handleTextSubmit(text: string) {
		if (!isTextSource || !tool.runFromText) return;
		errorText = '';
		status = 'processing';
		try {
			source = await tool.runFromText(text, defaultParams(tool));
			values = defaultParams(tool);
			result = null;
			textResult = null;
			previewResult = null;
			showMask = false;
			pipetteTargetId = null;
			info = null;
			await runTool();
		} catch (e) {
			showError(e);
		}
	}

	async function runTool() {
		if (isInfo) return;
		if (!source && !isSourceless) return;
		const token = ++runToken;
		hasLastRun = true;
		lastRunSource = source;
		lastRunValuesJson = JSON.stringify(sanitized);
		try {
			let next: PixelImage;
			if (isSourceless) {
				next = await tool.generate!(sanitized);
			} else {
				next = await tool.run(source!, sanitized);
			}
			let nextPreview: PixelImage | null = null;
			if (tool.preview && source) {
				try {
					nextPreview = await tool.preview(source, sanitized);
				} catch {
					nextPreview = null;
				}
			}
			let nextText: string | null = null;
			if (tool.toText && source) {
				nextText = await tool.toText(source, sanitized);
			}
			if (token !== runToken) return;
			result = next;
			previewResult = nextPreview;
			textResult = nextText;
			status = 'loaded';
		} catch (e) {
			if (token !== runToken) return;
			showError(e);
		}
	}

	$effect(() => {
		const valuesJson = JSON.stringify(sanitized);
		if (hasLastRun && source === lastRunSource && valuesJson === lastRunValuesJson) return;
		if (!source && !isSourceless) return;
		if (isInfo) return;
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
		previewResult = null;
		textResult = null;
		showMask = false;
		pipetteTargetId = null;
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

	<div class="stage panel" class:single={isSourceless}>
		{#if !isSourceless}
			<div class="cell">
				{#if isTextSource && !source}
					<TextInputCard onSubmit={handleTextSubmit} />
				{:else}
					<SourceCard
						{source}
						onFile={handleFile}
						onError={(message) => (errorText = message)}
						onReset={reset}
						pipetteActive={!!pipetteTargetId}
						onPickColor={handlePickColor}
					/>
				{/if}
			</div>
		{/if}
		<div class="cell">
			<ResultCard
				{tool}
				sourceLoaded={isSourceless ? true : !!source}
				{status}
				{result}
				{previewResult}
				bind:showMask
				{info}
				{isInfo}
				params={sanitized}
				{textResult}
				onDownloadError={showError}
			/>
		</div>
	</div>

	{#if (source || isSourceless) && !isInfo}
		<ParamsCard
			params={tool.params}
			bind:values
			{pipetteTargetId}
			onPipetteToggle={handlePipetteToggle}
		/>
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

	.stage.single {
		grid-template-columns: 1fr;
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
