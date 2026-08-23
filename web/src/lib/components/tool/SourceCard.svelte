<script lang="ts">
	import type { PixelImage } from '$lib/core/types';
	import DropOverlay from '../DropOverlay.svelte';
	import DropZone from '../DropZone.svelte';
	import Preview from '../Preview.svelte';
	import Button from '../ui/Button.svelte';

	interface Props {
		source: PixelImage | null;
		onFile: (file: File) => void;
		onError: (message: string) => void;
		onReset: () => void;
		pipetteActive?: boolean;
		onPickColor?: (hex: string) => void;
	}

	let { source, onFile, onError, onReset, pipetteActive = false, onPickColor }: Props = $props();
</script>

<div class="container">
	<h2 class="heading-section">Исходник</h2>
	{#if !source}
		<DropZone {onFile} {onError} />
	{:else}
		<DropOverlay {onFile} {onError}>
			<div class="media">
				<Preview image={source} pipetteActive={pipetteActive} onPickColor={onPickColor} />
			</div>
			<Button variant="secondary" onclick={onReset}>Заменить изображение</Button>
		</DropOverlay>
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
	}
</style>
