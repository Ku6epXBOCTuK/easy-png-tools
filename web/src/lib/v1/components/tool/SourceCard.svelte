<script lang="ts">
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/v1/i18n/t";
	import DropOverlay from "../DropOverlay.svelte";
	import DropZone from "../DropZone.svelte";
	import Preview from "../Preview.svelte";
	import Button from "../ui/Button.svelte";

	interface Props {
		source: PixelImage | null;
		onFile: (file: File) => void;
		onError: (e: unknown) => void;
		onReset: () => void;
		pipetteActive?: boolean;
		onPickColor?: (hex: string) => void;
	}

	let {
		source,
		onFile,
		onError,
		onReset,
		pipetteActive = false,
		onPickColor,
	}: Props = $props();
</script>

<div class="container">
	{#if !source}
		<DropZone {onFile} {onError} />
	{:else}
		<DropOverlay {onFile} {onError}>
			<div class="media">
				<Preview image={source} {pipetteActive} {onPickColor} />
			</div>
			<Button variant="secondary" onclick={onReset}
				>{t("sourceCard.replaceImage")}</Button
			>
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

	.media {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 16rem;
	}
</style>
