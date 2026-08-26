<script lang="ts">
	import { t } from '$lib/i18n/t';
	import type { PixelImage } from '$lib/core/types';
	import DropZone from '../DropZone.svelte';
	import Preview from '../Preview.svelte';
	import Button from '../ui/Button.svelte';

	interface Props {
		overlay: PixelImage | null;
		onFile: (file: File) => void;
		onError: (e: unknown) => void;
		onClear: () => void;
	}

	let { overlay, onFile, onError, onClear }: Props = $props();
</script>

<div class="overlay-card">
	<span class="edge-legend overlay-legend" aria-hidden="true">{t('ui.overlayTitle')}</span>
	{#if !overlay}
		<DropZone {onFile} {onError} label={t('ui.overlayDrop')} />
	{:else}
		<div class="preview-wrap">
			<Preview image={overlay} />
			<Button variant="secondary" onclick={onClear}>{t('ui.overlayRemove')}</Button>
		</div>
	{/if}
</div>

<style>
	.overlay-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px dashed var(--border);
	}

	.overlay-legend {
		top: -0.65em;
		left: 50%;
		transform: translateX(-50%);
		background: var(--surface);
	}

	.overlay-card :global(.dropzone) {
		min-height: 7rem;
		font-size: var(--text-s);
	}

	.preview-wrap {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		align-items: stretch;
	}

	.preview-wrap :global(.media) {
		max-height: 12rem;
	}
</style>
