<script lang="ts">
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import DownloadButton from "$lib/components/kit/ui/DownloadButton.svelte";
	import SchemaTextResult from "$lib/components/kit/SchemaTextResult.svelte";
	import SchemaTextSource from "$lib/components/kit/SchemaTextSource.svelte";
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { Check, Sparkles, Upload } from "@lucide/svelte";

	interface Props {
		source: PixelImage | null;
		result: PixelImage | null;
		textSource?: string;
		textResult?: string | null;
		resultKind?: "image" | "text" | "verdict";
		running: boolean;
		error: string;
		isGenerator?: boolean;
		onupload: (file: File) => void;
		ongenerate?: () => void;
		ontextsource?: (text: string) => void;
		onrendertext?: () => void;
		oncopytext?: () => void;
		ondownloadtxt?: () => void;
		ondownload: () => void;
	}
	let {
		source,
		result,
		textSource = "",
		textResult = null,
		resultKind = "image",
		running,
		error,
		isGenerator = false,
		onupload,
		ongenerate,
		ontextsource,
		onrendertext,
		oncopytext,
		ondownloadtxt,
		ondownload,
	}: Props = $props();

	const isTextInput = $derived(ontextsource !== undefined && !isGenerator);
	const isImageDownload = $derived(resultKind === "image" && Boolean(result));

	let sourceUrl = $derived(source ? toDataUrl(source) : null);
	let resultUrl = $derived(result ? toDataUrl(result) : null);
</script>

<div class="panel-head">
	<span class="label"
		>{isGenerator ? "GENERATOR / RESULT" : "SOURCE / RESULT"}</span
	>
	<div class="head-actions">
		{#if isGenerator}
			<button
				class="upload generate-btn"
				onclick={ongenerate}
				disabled={running}
			>
				<Sparkles size={14} />
				{running ? "Generating…" : "Generate"}
			</button>
		{:else if !isTextInput}
			<label class="upload">
				<Upload size={14} /> Open image
				<input
					type="file"
					accept="image/*"
					onchange={(e) => {
						const f = (e.target as HTMLInputElement).files?.[0];
						if (f) onupload(f);
					}}
				/>
			</label>
		{/if}
		{#if isImageDownload}
			<DownloadButton label="Download result" onclick={ondownload} />
		{/if}
	</div>
</div>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<div class="pair">
	{#if !isGenerator}
		<figure class="tile">
			<figcaption><span>SOURCE</span></figcaption>
			<div class="canvas">
				{#if isTextInput}
					<div class="text-source-wrap">
						<SchemaTextSource
							value={textSource}
							disabled={running}
							oninput={ontextsource ?? (() => {})}
							onrender={onrendertext ?? (() => {})}
						/>
					</div>
				{:else if sourceUrl}
					<img src={sourceUrl} alt="source" />
				{:else}
					<span class="empty">choose an image</span>
				{/if}
			</div>
		</figure>
	{/if}
	<figure class="tile" class:full={isGenerator || resultKind !== "image"}>
		<figcaption><span>RESULT {running ? "…" : ""}</span></figcaption>
		<div class="canvas" class:checker={resultKind === "image"}>
			{#if resultKind === "text" && textResult}
				<div class="text-result-wrap">
					<SchemaTextResult
						value={textResult}
						kind="text"
						oncopy={oncopytext ?? (() => {})}
						ondownload={ondownloadtxt ?? (() => {})}
					/>
				</div>
			{:else if resultKind === "verdict" && textResult}
				<div class="text-result-wrap">
					<SchemaTextResult
						value={textResult}
						kind="verdict"
						oncopy={oncopytext ?? (() => {})}
						ondownload={ondownloadtxt ?? (() => {})}
					/>
				</div>
			{:else if resultKind === "image" && resultUrl}
				<img src={resultUrl} alt="result" />
			{:else if running}
				<Check size={22} />
			{:else}
				<span class="empty">
					{isGenerator ? "click Generate" : "no result yet"}
				</span>
			{/if}
		</div>
	</figure>
</div>

<div class="meta">
	<MetaList
		items={[
			{
				caption: "SOURCE",
				value:
					!isGenerator && !isTextInput
						? source
							? `${source.width} × ${source.height} px`
							: "—"
						: isTextInput
							? "text"
							: "—",
			},
			{
				caption: "RESULT",
				value:
					resultKind === "image"
						? result
							? `${result.width} × ${result.height} px`
							: "—"
						: textResult
							? "text"
							: "—",
			},
			{ caption: "FORMAT", value: "PNG" },
		]}
	/>
</div>

<style>
	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-m);
		padding-bottom: var(--space-l);
		border-bottom: var(--size-border) solid var(--color-border);
		margin-bottom: var(--space-xl);
	}
	.label {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-main);
	}
	.head-actions {
		display: flex;
		align-items: center;
		gap: var(--space-l);
		flex-wrap: wrap;
	}
	.upload {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.generate-btn {
		background: var(--color-main);
		border-color: var(--color-main);
		color: var(--color-background);
	}
	.generate-btn:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.upload input {
		display: none;
	}
	.error {
		margin: 0 0 var(--space-l);
		color: var(--color-danger);
		font: var(--font-size-s) var(--font-mono);
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-l);
	}
	.pair > .full {
		grid-column: 1 / -1;
	}
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
		border-radius: var(--radius-m);
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
	.text-source-wrap,
	.text-result-wrap {
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
	}
	.meta {
		margin-top: var(--space-l);
	}
	@media (max-width: var(--bp-tablet)) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
