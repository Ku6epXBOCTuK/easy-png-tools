<script lang="ts">
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";
	import Dropzone from "$lib/components/kit/Dropzone.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import Panel from "$lib/components/kit/layout/Panel.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import PreviewStack from "$lib/components/kit/PreviewStack.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import StatusLine from "$lib/components/kit/StatusLine.svelte";
	import Button from "$lib/components/kit/ui/Button.svelte";
	import DownloadButton from "$lib/components/kit/ui/DownloadButton.svelte";
	import type { PixelImage } from "$lib/core/types";

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

<Panel title="Pipeline output" eyebrow="RESULT">
	{#if resultUrl}
		<DownloadButton label="Download result" onclick={onDownload} />
	{/if}

	<div class="preview-body">
		{#if chainError}
			<EmptyState title="Pipeline failed" description={chainError} />
		{/if}
		{#if needsSource && !sourceImg}
			<Dropzone onfile={onFile} />
		{:else if needsSource && sourceImg}
			<Button variant="outline" onclick={onClearSource} label="Change image" />
		{/if}
		<PreviewStack>
			{#if needsSource && sourceImg}
				<PreviewTile label="SOURCE" caption="">
					<CheckerCanvas size="sm">
						<img class="tile-img" src={sourceUrl} alt="source" />
					</CheckerCanvas>
				</PreviewTile>
			{/if}
			{#each stepOutputs as out, i (out.toolId + i)}
				<PreviewTile
					label={`STEP ${String(i + 1).padStart(2, "0")}`}
					caption=""
				>
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
