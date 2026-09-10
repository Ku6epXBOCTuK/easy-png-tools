<script lang="ts">
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import type { InputMode } from "$lib/registry-new";
	import SchemaTextSource from "./SchemaTextSource.svelte";

	interface Props {
		mode: InputMode;
		source: PixelImage | null;
		textSource?: string;
		running?: boolean;
		ontextinput?: (text: string) => void;
		onrendertext?: () => void;
	}
	let {
		mode,
		source,
		textSource = "",
		running = false,
		ontextinput,
		onrendertext,
	}: Props = $props();

	const sourceUrl = $derived(source ? toDataUrl(source) : null);
</script>

<figure class="tile">
	<figcaption><span>SOURCE</span></figcaption>
	<div class="canvas">
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
			<img src={sourceUrl} alt="source" />
		{:else if mode === "image"}
			<span class="empty">choose an image</span>
		{:else}
			<span class="empty">no source — configure the parameters</span>
		{/if}
	</div>
</figure>

<style>
	.tile figcaption {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		margin-bottom: var(--space-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
	}
	.canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: clamp(var(--space-brand), 30vh, 60vh);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		overflow: hidden;
		background: var(--color-background-muted);
		color: var(--color-text-muted);
	}
	.canvas img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	.text-source-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}
</style>
