<script lang="ts">
	import Button from '../ui/Button.svelte';
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
		displayImage: PixelImage | null;
		info: ImageInfo | null;
		isInfo: boolean;
		params: Record<string, unknown>;
		textResult: string | null;
		onChainToggle?: () => void;
		hasChain?: boolean;
		onDownloadError: (e: unknown) => void;
	}

	let {
		tool,
		sourceLoaded,
		status,
		result,
		displayImage,
		info,
		isInfo,
		params,
		textResult,
		onChainToggle,
		hasChain = false,
		onDownloadError
	}: Props = $props();
</script>

<div class="container">
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
		<div class="media">
			<Preview image={displayImage} />
			{#if status === 'processing'}
				<span class="recalc" aria-live="polite">Пересчёт…</span>
			{/if}
		</div>
		<div class="actions-row">
			<DownloadButton
				image={result}
				format={outputOf(tool)}
				baseName={tool.id}
				{params}
				onError={onDownloadError}
			/>
			{#if onChainToggle}
				<Button variant="secondary" fullWidth onclick={onChainToggle}>
					{hasChain ? '✂ Оборвать цепочку' : '⛓ Следующий инструмент'}
				</Button>
			{/if}
		</div>
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
