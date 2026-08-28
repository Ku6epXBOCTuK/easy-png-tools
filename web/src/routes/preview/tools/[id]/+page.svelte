<script lang="ts">
	import { browser } from "$app/environment";
	import { untrack } from "svelte";
	import { getTool, defaultParams } from "$lib/registry";
	import { encode, downloadBlob, toDataUrl, decodeBytes } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import SelectField from "$lib/components/kit/SelectField.svelte";
	import Toggle from "$lib/components/kit/Toggle.svelte";
	import TextField from "$lib/components/kit/TextField.svelte";
	import NumberField from "$lib/components/kit/NumberField.svelte";
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import Badge from "$lib/components/kit/Badge.svelte";
	import StatusLine from "$lib/components/kit/StatusLine.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import Button from "$lib/components/kit/Button.svelte";
	import Dropzone from "$lib/components/kit/Dropzone.svelte";
	import { SlidersHorizontal as ToolIcon } from "@lucide/svelte";

	type ParamValue = string | number | boolean;

	interface Props {
		data: { id: string };
	}
	let { data }: Props = $props();

	const initialTool = untrack(() => getTool(data.id));
	let params = $state<Record<string, ParamValue>>(
		initialTool
			? (defaultParams(initialTool) as Record<string, ParamValue>)
			: {},
	);
	let previewUrl = $state("");
	let previewError = $state("");

	let sourceImg = $state<PixelImage | null>(null);
	let sourceUrl = $state("");
	let sourceName = $state("");
	let resultImg = $state<PixelImage | null>(null);
	let resultUrl = $state("");
	let showMask = $state(false);

	const tool = $derived(getTool(data.id));

	$effect(() => {
		const next = getTool(data.id);
		if (next) params = defaultParams(next) as Record<string, ParamValue>;
	});

	$effect(() => {
		if (!tool || !tool.generate) {
			previewUrl = "";
			return;
		}
		if (!browser) return;
		const snapshot = { ...params };
		try {
			const result = tool.generate(snapshot);
			if (result instanceof Promise) {
				result
					.then((img) => {
						previewUrl = toDataUrl(img);
						previewError = "";
					})
					.catch((e) => {
						previewError = String(e);
					});
			} else {
				previewUrl = toDataUrl(result);
				previewError = "";
			}
		} catch (e) {
			previewError = String(e);
		}
	});

	$effect(() => {
		const src = sourceImg;
		if (!tool || !tool.run || !src) {
			resultImg = null;
			resultUrl = "";
			return;
		}
		if (!browser) return;
		const snapshot = { ...params };
		const mask = showMask && !!tool.preview;
		try {
			const base = mask
				? tool.preview!(src, snapshot)
				: tool.run(src, snapshot);
			const apply = (img: PixelImage) => {
				resultImg = img;
				resultUrl = toDataUrl(img);
				previewError = "";
			};
			if (base instanceof Promise) {
				base.then(apply).catch((e) => (previewError = String(e)));
			} else {
				apply(base);
			}
		} catch (e) {
			previewError = String(e);
		}
	});

	async function onFile(file: File) {
		if (!browser) return;
		try {
			const bytes = new Uint8Array(await file.arrayBuffer());
			const img = await decodeBytes(bytes);
			sourceImg = img;
			sourceName = file.name;
			sourceUrl = toDataUrl(img);
			previewError = "";
		} catch (e) {
			previewError = String(e);
		}
	}

	function clearSource() {
		sourceImg = null;
		sourceUrl = "";
		sourceName = "";
		resultImg = null;
		resultUrl = "";
	}

	async function download() {
		if (!tool?.generate) return;
		const result = tool.generate({ ...params });
		const img = result instanceof Promise ? await result : result;
		const blob = await encode(img, "image/png");
		downloadBlob(blob, `${tool.id}.png`);
	}

	async function downloadResult() {
		if (!resultImg || !tool) return;
		const blob = await encode(resultImg, "image/png");
		const base = sourceName.replace(/\.[^.]+$/, "");
		downloadBlob(blob, `${base}-${tool.id}.png`);
	}

	function setParam(id: string, value: ParamValue) {
		params[id] = value;
	}

	const isFileTool = $derived(
		tool ? tool.sourceMode === "file" || tool.sourceMode === undefined : false,
	);

	const meta = $derived(
		tool
			? [
					{ caption: "TOOL", value: tool.id },
					{ caption: "CATEGORY", value: tool.category.toUpperCase() },
					...(tool.sourceMode === "none" &&
					"width" in params &&
					"height" in params
						? [
								{
									caption: "OUTPUT",
									value: `${params.width} × ${params.height} px`,
								},
							]
						: []),
				]
			: [],
	);
</script>

<svelte:head>
	<title>easy-png-tools / {tool?.title ?? "Tool"}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#snippet settingsPanel()}
	<Panel>
		<PanelHeading title={tool!.title} eyebrow={tool!.category}>
			{#snippet actions()}
				<Badge tone="accent">AUTO</Badge>
			{/snippet}
		</PanelHeading>
		<p class="tool-desc">{tool!.description}</p>
		<div class="settings-body">
			{#each tool!.params as p (p.id)}
				<div class="setting-row">
					{#if p.type === "color"}
						<ColorField
							label={p.label}
							value={params[p.id] as string}
							oninput={(v) => setParam(p.id, v)}
						/>
					{:else if p.type === "slider"}
						<SliderField
							label={p.label}
							value={params[p.id] as number}
							min={p.min}
							max={p.max}
							step={p.step}
							oninput={(v) => setParam(p.id, v)}
						/>
					{:else if p.type === "select"}
						<SelectField
							label={p.label}
							value={params[p.id] as string}
							options={p.options}
							onchange={(v) => setParam(p.id, v)}
						/>
					{:else if p.type === "checkbox"}
						<label class="toggle-row"
							><span>{p.label}</span>
							<Toggle
								checked={params[p.id] as boolean}
								onchange={(v) => setParam(p.id, v)}
							/></label
						>
					{:else if p.type === "text"}
						<TextField
							label={p.label}
							value={params[p.id] as string}
							placeholder={p.placeholder}
							oninput={(v) => setParam(p.id, v)}
						/>
					{:else if p.type === "number"}
						<NumberField
							label={p.label}
							value={params[p.id] as number}
							min={p.min}
							max={p.max}
							step={p.step}
							oninput={(v) => setParam(p.id, v)}
						/>
					{/if}
				</div>
			{/each}
		</div>
		<SettingsFooter>
			<StatusLine label="changes applied automatically" />
		</SettingsFooter>
	</Panel>
{/snippet}

{#if !tool}
	<div class="tool-grid">
		<EmptyState
			title="Tool not found"
			description="No tool is registered under “{data.id}”."
			icon={ToolIcon}
		/>
	</div>
{:else if tool.sourceMode === "none"}
	<div class="tool-grid">
		<section class="settings-panel">{@render settingsPanel()}</section>
		<section class="preview-panel">
			<Panel>
				<PanelHeading title="Preview" eyebrow="OUTPUT">
					{#snippet actions()}
						<DownloadButton label="Download PNG" onclick={download} />
					{/snippet}
				</PanelHeading>
				<div class="preview-body">
					{#if previewError}
						<EmptyState title="Preview failed" description={previewError} />
					{:else if previewUrl}
						<CheckerCanvas size="large">
							<img class="result-img" src={previewUrl} alt="result" />
						</CheckerCanvas>
					{:else if tool.generate}
						<div class="preview-loading">
							<StatusLine label="generating preview" />
						</div>
					{:else}
						<EmptyState
							title="No live preview"
							description="This tool runs on an uploaded image."
							icon={ToolIcon}
						/>
					{/if}
					<MetaList items={meta} />
				</div>
			</Panel>
		</section>
	</div>
{:else if isFileTool}
	<div class="tool-grid remover-grid">
		<section class="settings-panel">{@render settingsPanel()}</section>
		<section class="preview-panel">
			<Panel>
				<PanelHeading title="Source / Result" eyebrow="OUTPUT">
					{#snippet actions()}
						{#if resultUrl}
							<DownloadButton
								label="Download result"
								onclick={downloadResult}
							/>
						{/if}
					{/snippet}
				</PanelHeading>
				<div class="preview-body">
					{#if previewError}
						<EmptyState title="Processing failed" description={previewError} />
					{/if}
					{#if !sourceImg}
						<Dropzone onfile={onFile} />
					{:else}
						<div class="comparison-grid">
							<div class="image-card">
								<div class="image-label">
									<span>SOURCE</span><b>{sourceName}</b>
								</div>
								<div class="remover-canvas">
									<CheckerCanvas size="large">
										<img class="cmp-img" src={sourceUrl} alt="source" />
									</CheckerCanvas>
									<span class="canvas-size"
										>{sourceImg.width} × {sourceImg.height}</span
									>
								</div>
							</div>
							<div class="image-card">
								<div class="image-label">
									<span>RESULT</span><b>{sourceName}</b>
								</div>
								<div class="remover-canvas">
									{#if resultUrl}
										<CheckerCanvas size="large">
											<img class="cmp-img" src={resultUrl} alt="result" />
										</CheckerCanvas>
									{/if}
									<span class="canvas-size"
										>{resultImg
											? `${resultImg.width} × ${resultImg.height}`
											: "—"}</span
									>
								</div>
							</div>
						</div>
						<div class="result-meta">
							<span>FORMAT <b>PNG-24</b></span>
							<span>ALPHA <b>ENABLED</b></span>
							<span>STATUS <b class="ok">PROCESSED</b></span>
						</div>
						<Button variant="ghost" onclick={clearSource}
							>Change image</Button
						>
					{/if}
				</div>
			</Panel>
		</section>
	</div>
{:else}
	<div class="tool-grid">
		<section class="settings-panel">{@render settingsPanel()}</section>
		<section class="preview-panel">
			<Panel>
				<PanelHeading title="Preview" eyebrow="OUTPUT" />
				<div class="preview-body">
					<EmptyState
						title="Text source"
						description="Paste text on the left — arrives in a later step."
						icon={ToolIcon}
					/>
				</div>
			</Panel>
		</section>
	</div>
{/if}

<style>
	.tool-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: start;
		gap: 40px;
		max-width: 1680px;
		margin: 0 auto;
		padding: 48px clamp(24px, 4vw, 72px) 72px;
	}
	.remover-grid {
		grid-template-columns: minmax(360px, 0.62fr) minmax(0, 1.38fr);
	}
	.tool-desc {
		margin: 0;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--line);
		color: var(--muted);
		font-size: 0.85rem;
		line-height: 1.55;
	}
	.settings-body {
		display: flex;
		flex-direction: column;
	}
	.setting-row {
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--line);
	}
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		color: var(--foreground);
		font-size: 0.85rem;
		cursor: pointer;
	}
	.preview-panel {
		position: sticky;
		top: 84px;
	}
	.preview-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}
	.preview-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--muted);
	}
	.result-img {
		max-width: 100%;
		max-height: 360px;
		display: block;
		border-radius: var(--radius);
	}
	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}
	.image-card {
		min-width: 0;
	}
	.image-label {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 10px;
		font: 10px var(--font-mono);
		color: var(--muted);
		letter-spacing: 0.08em;
	}
	.image-label span {
		color: var(--blue);
	}
	.image-label b {
		font-weight: 400;
	}
	.remover-canvas {
		position: relative;
		overflow: hidden;
	}
	.cmp-img {
		max-width: 100%;
		max-height: 420px;
		display: block;
	}
	.canvas-size {
		position: absolute;
		bottom: 9px;
		right: 10px;
		font: 9px var(--font-mono);
		color: var(--muted);
		background: color-mix(in srgb, var(--panel) 70%, transparent);
		padding: 2px 5px;
		border-radius: var(--radius);
	}
	.result-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 18px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font: 10px var(--font-mono);
		color: var(--muted);
		letter-spacing: 0.08em;
	}
	.result-meta b {
		margin-left: 6px;
		color: var(--foreground);
		font-weight: 600;
	}
	.result-meta b.ok {
		color: var(--success);
	}
	@media (max-width: 900px) {
		.tool-grid,
		.remover-grid {
			grid-template-columns: 1fr;
			gap: 24px;
			padding: 32px 16px 48px;
		}
		.preview-panel {
			position: static;
		}
		.comparison-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
