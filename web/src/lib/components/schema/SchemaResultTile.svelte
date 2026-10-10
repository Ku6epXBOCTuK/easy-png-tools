<script lang="ts">
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { FileResult, ResultKind, ResultNote } from "$lib/registry";
	import { Check } from "@lucide/svelte";
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import SchemaTextResult from "./SchemaTextResult.svelte";
	import PreviewTile from "./PreviewTile.svelte";

	interface Props {
		resultKind?: ResultKind;
		result: PixelImage | null;
		resultNote?: ResultNote | null;
		fileResult?: FileResult | null;
		textResult?: string | null;
		textVars?: Record<string, string | number>;
		toolId?: string;
		running?: boolean;
		mask?: PixelImage | null;
		maskOn?: boolean;
		ontogglemask?: () => void;
		oncopy?: () => void;
		ondownloadtxt?: () => void;
	}
	let {
		resultKind = "image",
		result,
		resultNote = null,
		fileResult = null,
		textResult = null,
		textVars = undefined,
		toolId = "",
		running = false,
		mask = null,
		maskOn = false,
		ontogglemask,
		oncopy,
		ondownloadtxt,
	}: Props = $props();

	const shown = $derived(maskOn && mask ? mask : result);
	const resultUrl = $derived(shown ? toDataUrl(shown) : null);
	const resultDims = $derived(
		resultKind === "image" && result
			? `${result.width} × ${result.height}`
			: undefined,
	);

	let parts = $derived(
		resultKind === "files" && fileResult ? fileResult.files.length : undefined,
	);
	// All parts share the same size (canvas is padded); show it once.
	let partsDims = $derived(
		resultKind === "files" && fileResult && fileResult.files.length > 0
			? `${fileResult.files[0].image.width} × ${fileResult.files[0].image.height}`
			: undefined,
	);
</script>

<PreviewTile
	label={t("resultCard.result")}
	viewMode={resultKind}
	loading={running}
	{parts}
	{partsDims}
	dims={resultDims}
	note={resultNote ? t(resultNote.key) : undefined}
	noteTone={resultNote?.tone ?? "warning"}
>
	{#snippet actions()}
		{#if ontogglemask}
			<ChipButton
				label={t("resultCard.maskToggle")}
				active={maskOn}
				onclick={ontogglemask}
			/>
		{/if}
	{/snippet}
	<div class="canvas" class:checker={resultKind === "image"}>
		{#if resultKind === "text" && textResult}
			<div class="text-result-wrap">
				<SchemaTextResult
					value={textResult}
					kind="text"
					oncopy={oncopy ?? (() => {})}
					ondownload={ondownloadtxt ?? (() => {})}
				/>
			</div>
		{:else if resultKind === "verdict" && textResult}
			<div class="text-result-wrap">
				<SchemaTextResult
					value={textResult}
					kind="verdict"
					vars={textVars}
					{toolId}
					oncopy={oncopy ?? (() => {})}
					ondownload={ondownloadtxt ?? (() => {})}
				/>
			</div>
		{:else if resultKind === "files" && fileResult && fileResult.files.length > 0}
			<PartsGrid files={fileResult.files} />
		{:else if resultKind === "image" && resultUrl}
			<img
				data-testid="result-image"
				src={resultUrl}
				alt={t("resultCard.alt")}
			/>
		{:else if running}
			<Check size={22} />
		{:else}
			<span data-testid="empty-state" class="empty"
				>{t("resultCard.noResult")}</span
			>
		{/if}
	</div>
</PreviewTile>

<style>
	.canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		/* Вложен в PreviewTile.canvas: без растяжения сжимался по контенту и
		   ломал parts-grid в одну колонку. */
		width: 100%;
		align-self: stretch;
		min-height: var(--size-tile-canvas-min);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		overflow: auto;
		background: var(--color-background-muted);
		color: var(--color-text-muted);
	}
	.canvas img {
		width: auto;
		max-width: 100%;
		height: auto;
		max-height: 60vh;
		object-fit: contain;
		display: block;
	}
	.canvas.checker {
		background: repeating-conic-gradient(
				var(--color-checker-main) 0 25%,
				var(--color-checker-alt) 0 50%
			)
			50% / 28px 28px;
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	.text-result-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}
</style>
