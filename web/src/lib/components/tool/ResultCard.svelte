<script lang="ts">
	import CheckboxField from '../ui/CheckboxField.svelte';
	import DownloadButton from '../DownloadButton.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import InfoPanel from '../InfoPanel.svelte';
	import Preview from '../Preview.svelte';
	import TextResult from './TextResult.svelte';
	import type { ImageInfo } from '$lib/core/analyze';
	import type { PixelImage } from '$lib/core/types';
	import { outputOf, type ToolEntry } from '$lib/registry';

	type Status = 'idle' | 'loaded' | 'processing' | 'error';

	interface Props {
		tool: ToolEntry;
		sourceLoaded: boolean;
		status: Status;
		result: PixelImage | null;
		previewResult: PixelImage | null;
		showMask: boolean;
		info: ImageInfo | null;
		isInfo: boolean;
		params: Record<string, unknown>;
		textResult: string | null;
		onDownloadError: (e: unknown) => void;
	}

	let {
		tool,
		sourceLoaded,
		status,
		result,
		previewResult,
		showMask = $bindable(false),
		info,
		isInfo,
		params,
		textResult,
		onDownloadError
	}: Props = $props();

	const hasPreview = $derived(typeof tool.preview === 'function');
	const shown = $derived(showMask && previewResult ? previewResult : result);
</script>

<div class="container">
	<h2 class="heading-section">{isInfo ? 'Сводка' : 'Результат'}</h2>
	{#if !sourceLoaded}
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
	{:else if tool.resultType === 'text'}
		<div class="media">
			{#if textResult !== null}
				<TextResult text={textResult} filename={tool.id} />
			{/if}
		</div>
	{:else}
		{#if hasPreview}
			<CheckboxField id="show-mask" label="Показать маску" bind:checked={showMask} />
		{/if}
		<div class="media">
			<Preview image={shown} />
			{#if status === 'processing'}
				<span class="recalc" aria-live="polite">Пересчёт…</span>
			{/if}
		</div>
		<DownloadButton
			image={result}
			format={outputOf(tool)}
			baseName={tool.id}
			{params}
			onError={onDownloadError}
		/>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
		height: 100%;
	}

	h2 {
		margin-bottom: var(--space-1);
	}

	.media {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 16rem;
		position: relative;
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
