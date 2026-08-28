<script lang="ts">
	import type { PixelImage } from "$lib/core/types";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import PreviewStack from "$lib/components/kit/PreviewStack.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import Dropzone from "$lib/components/kit/Dropzone.svelte";
	import Button from "$lib/components/kit/Button.svelte";
	import StatusLine from "$lib/components/kit/StatusLine.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";

	interface PreviewItem {
		toolId: string;
		title: string;
		url: string;
	}

	interface MetaItem {
		caption: string;
		value: string;
	}

	interface Props {
		needsSource: boolean;
		sourceImg: PixelImage | null;
		sourceUrl: string;
		stepOutputs: PreviewItem[];
		resultUrl: string;
		resultMeta: MetaItem[];
		processing: boolean;
		chainError: string;
		onFile: (file: File) => void;
		onClearSource: () => void;
		onDownload: () => void;
	}

	let {
		needsSource,
		sourceImg,
		sourceUrl,
		stepOutputs,
		resultUrl,
		resultMeta,
		processing,
		chainError,
		onFile,
		onClearSource,
		onDownload,
	}: Props = $props();
</script>

<Panel>
	<PanelHeading title="Pipeline output" eyebrow="RESULT">
		{#snippet actions()}
			{#if resultUrl}
				<DownloadButton label="Download result" onclick={onDownload} />
			{/if}
		{/snippet}
	</PanelHeading>
	<div class="preview-body">
		{#if chainError}
			<EmptyState title="Pipeline failed" description={chainError} />
		{/if}
		{#if needsSource && !sourceImg}
			<Dropzone onfile={onFile} />
		{:else if needsSource && sourceImg}
			<Button variant="ghost" onclick={onClearSource}>Change image</Button>
		{/if}
		<PreviewStack>
			{#if needsSource && sourceImg}
				<PreviewTile label="SOURCE">
					<CheckerCanvas size="sm">
						<img class="tile-img" src={sourceUrl} alt="source" />
					</CheckerCanvas>
				</PreviewTile>
			{/if}
			{#each stepOutputs as out, i (out.toolId + i)}
				<PreviewTile label={`STEP ${String(i + 1).padStart(2, "0")}`}>
					<CheckerCanvas size="sm">
						<img class="tile-img" src={out.url} alt={out.title} />
					</CheckerCanvas>
				</PreviewTile>
			{/each}
		</PreviewStack>
		{#if processing}
			<StatusLine label="processing pipeline" />
		{/if}
		<MetaList items={resultMeta} />
	</div>
</Panel>

<style>
	.preview-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}
	.tile-img {
		max-width: 100%;
		max-height: 220px;
		display: block;
		border-radius: var(--radius);
	}
</style>
