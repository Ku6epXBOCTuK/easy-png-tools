<script lang="ts">
	import { cachedDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { InputMode, ToolImageFile } from "$lib/registry";
	import Dropzone from "./Dropzone.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import SchemaTextSource from "./SchemaTextSource.svelte";

	interface Props {
		mode: InputMode;
		source: PixelImage | null;
		sources?: ToolImageFile[];
		textSource?: string;
		running?: boolean;
		fileCount?: number;
		ontextinput?: (text: string) => void;
		onrendertext?: () => void;
		onupload?: (file: File) => void;
		onuploadmany?: (files: File[]) => void;
	}
	let {
		mode,
		source,
		sources = [],
		textSource = "",
		running = false,
		fileCount = 0,
		ontextinput,
		onrendertext,
		onupload,
		onuploadmany,
	}: Props = $props();

	const sourceUrl = $derived(source ? cachedDataUrl(source) : null);
	const sourceDims = $derived(
		source
			? `${source.width} × ${source.height}` +
					(fileCount > 1
						? ` · ${t("sourceCard.countFiles", { count: fileCount })}`
						: "")
			: undefined,
	);

	let dragging = $state(false);
	let input = $state<HTMLInputElement | null>(null);
	// Replace hint: show on hover, fade after 10s until the next hover.
	let hintVisible = $state(false);
	let hintTimer: ReturnType<typeof setTimeout> | null = null;

	function showHint() {
		hintVisible = true;
		if (hintTimer) clearTimeout(hintTimer);
		hintTimer = setTimeout(() => {
			hintVisible = false;
			hintTimer = null;
		}, 3_000);
	}

	function hideHint() {
		hintVisible = false;
		if (hintTimer) {
			clearTimeout(hintTimer);
			hintTimer = null;
		}
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		pickFiles(Array.from(e.dataTransfer?.files ?? []));
	}

	function pickFiles(files: File[]) {
		if (files.length === 0) return;
		if (files.length > 1 && onuploadmany) onuploadmany(files);
		else if (files[0]) onupload?.(files[0]);
	}

	function open() {
		input?.click();
	}
</script>

<PreviewTile label={t("sourceCard.source")} viewMode={mode} dims={sourceDims}>
	{#if mode === "text"}
		<div class="text-source-wrap">
			<SchemaTextSource
				value={textSource}
				disabled={running}
				oninput={ontextinput ?? (() => {})}
				onrender={onrendertext ?? (() => {})}
			/>
		</div>
	{:else if mode === "image" && sourceUrl}
		<div
			class="tile-drop"
			class:dragging
			class:hint={hintVisible}
			role="button"
			tabindex="0"
			aria-label={t("sourceCard.replaceImage")}
			onclick={open}
			onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					open();
				}
			}}
			ondragover={(e) => {
				e.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			ondrop={onDrop}
			onmouseenter={showHint}
			onmouseleave={hideHint}
			onfocus={showHint}
			onblur={hideHint}
		>
			<input
				bind:this={input}
				type="file"
				accept="image/*"
				multiple
				hidden
				onchange={(e) => {
					pickFiles(Array.from((e.target as HTMLInputElement).files ?? []));
				}}
			/>
			{#if sources.length > 1}
				<PartsGrid files={sources} />
			{:else}
				<img
					data-testid="source-image"
					src={sourceUrl}
					alt={t("sourceCard.alt")}
				/>
			{/if}
			{#if dragging}
				<span class="drop-hint">{t("dropZone.overlayDefault")}</span>
			{:else}
				<span class="hover-hint">{t("sourceCard.replaceHint")}</span>
			{/if}
		</div>
	{:else if mode === "image"}
		<Dropzone onfile={onupload} onfiles={onuploadmany} />
	{:else}
		<span class="empty">{t("sourceCard.noSource")}</span>
	{/if}
</PreviewTile>

<style>
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	.text-source-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}
	.tile-drop {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		align-self: stretch;
	}
	.tile-drop.dragging::after {
		content: "";
		position: absolute;
		inset: 0;
		border: var(--size-border-thick) dashed var(--color-main);
		border-radius: var(--radius-m);
		background: var(--color-main-tint);
		pointer-events: none;
	}
	.tile-drop .drop-hint {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: var(--space-l);
		color: var(--color-main);
		font: var(--font-size-s) var(--font-mono);
		text-align: center;
		pointer-events: none;
	}
	.tile-drop {
		cursor: pointer;
	}
	.tile-drop::before {
		content: "";
		position: absolute;
		inset: 0;
		background: var(--color-scrim);
		opacity: 0;
		transition: opacity var(--duration-s) ease;
		pointer-events: none;
	}
	.tile-drop.hint::before {
		opacity: 1;
	}
	.tile-drop .hover-hint {
		position: absolute;
		inset: 25%;
		display: grid;
		place-items: center;
		padding: var(--space-l);
		border: var(--size-border-thick) dashed var(--color-main);
		border-radius: var(--radius-m);
		background: var(--color-panel);
		color: var(--color-main);
		font: 600 var(--font-size-l) var(--font-mono);
		text-align: center;
		opacity: 0;
		transition: opacity var(--duration-s) ease;
		pointer-events: none;
	}
	.tile-drop.hint .hover-hint {
		opacity: 1;
	}
</style>
