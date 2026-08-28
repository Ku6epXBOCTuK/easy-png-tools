<script lang="ts">
	import { browser } from "$app/environment";
	import { untrack } from "svelte";
	import {
		getTool,
		defaultParams,
		isChainable,
		TOOLS,
		type ParamDef,
	} from "$lib/registry";
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
	import StepCard from "$lib/components/kit/StepCard.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import { SlidersHorizontal as ToolIcon } from "@lucide/svelte";

	type ParamValue = string | number | boolean;

	interface ChainStep {
		toolId: string;
		params: Record<string, ParamValue>;
	}

	interface Props {
		data: { id: string };
	}
	let { data }: Props = $props();

	const initialTool = untrack(() => getTool(data.id));
	let steps = $state<ChainStep[]>(
		initialTool
			? [
					{
						toolId: initialTool.id,
						params: defaultParams(initialTool) as Record<string, ParamValue>,
					},
				]
			: [],
	);

	let sourceImg = $state<PixelImage | null>(null);
	let sourceUrl = $state("");
	let sourceName = $state("");

	let stepOutputs = $state<{ toolId: string; title: string; url: string }[]>(
		[],
	);
	let resultImg = $state<PixelImage | null>(null);
	let resultUrl = $state("");
	let chainError = $state("");
	let processing = $state(false);

	const chainOptions = TOOLS.filter(isChainable).map((t) => ({
		value: t.id,
		label: t.title,
	}));
	let addId = $state(chainOptions[0]?.value ?? "");

	const firstTool = $derived(steps[0] ? getTool(steps[0].toolId) : undefined);
	const needsSource = $derived(
		firstTool ? firstTool.sourceMode !== "none" : false,
	);

	$effect(() => {
		const t = getTool(data.id);
		if (t) {
			steps = [
				{
					toolId: t.id,
					params: defaultParams(t) as Record<string, ParamValue>,
				},
			];
			sourceImg = null;
			sourceUrl = "";
			sourceName = "";
		}
	});

	$effect(() => {
		if (!browser) return;
		const chain = steps.map((s) => ({
			tool: getTool(s.toolId),
			params: { ...s.params },
		}));
		const src = sourceImg;
		if (!chain.length || chain.some((c) => !c.tool)) {
			resultImg = null;
			resultUrl = "";
			stepOutputs = [];
			return;
		}
		const first = chain[0].tool!;
		if (first.sourceMode !== "none" && !src) {
			resultImg = null;
			resultUrl = "";
			stepOutputs = [];
			return;
		}
		void runPipeline(chain, src);
	});

	async function runPipeline(
		chain: {
			tool: ReturnType<typeof getTool>;
			params: Record<string, ParamValue>;
		}[],
		src: PixelImage | null,
	) {
		processing = true;
		try {
			let current: PixelImage | null = src;
			const outs: { toolId: string; title: string; url: string }[] = [];
			for (const c of chain) {
				const tool = c.tool!;
				const resolve = (x: PixelImage | Promise<PixelImage>) =>
					x instanceof Promise ? x : Promise.resolve(x);
				let out: PixelImage;
				if (!current && tool.sourceMode === "none" && tool.generate) {
					out = await resolve(tool.generate(c.params));
				} else if (current && tool.run) {
					out = await resolve(tool.run(current, c.params));
				} else if (!current && src && tool.run) {
					out = await resolve(tool.run(src, c.params));
				} else {
					continue;
				}
				current = out;
				outs.push({ toolId: tool.id, title: tool.title, url: toDataUrl(out) });
			}
			stepOutputs = outs;
			resultImg = current;
			resultUrl = current ? toDataUrl(current) : "";
			chainError = "";
		} catch (e) {
			chainError = String(e);
		} finally {
			processing = false;
		}
	}

	async function onFile(file: File) {
		if (!browser) return;
		try {
			const bytes = new Uint8Array(await file.arrayBuffer());
			const img = await decodeBytes(bytes);
			sourceImg = img;
			sourceName = file.name;
			sourceUrl = toDataUrl(img);
			chainError = "";
		} catch (e) {
			chainError = String(e);
		}
	}

	function clearSource() {
		sourceImg = null;
		sourceUrl = "";
		sourceName = "";
	}

	function setStepParam(index: number, id: string, value: ParamValue) {
		steps[index].params[id] = value;
	}

	function addStep() {
		const tool = getTool(addId);
		if (!tool) return;
		steps = [
			...steps,
			{
				toolId: tool.id,
				params: defaultParams(tool) as Record<string, ParamValue>,
			},
		];
	}

	function removeStep(index: number) {
		steps = steps.filter((_, i) => i !== index);
	}

	async function downloadResult() {
		if (!resultImg || !firstTool) return;
		const blob = await encode(resultImg, "image/png");
		const base = sourceName ? sourceName.replace(/\.[^.]+$/, "") : firstTool.id;
		downloadBlob(blob, `${base}-pipeline.png`);
	}

	const resultMeta = $derived(
		resultImg
			? [
					{ caption: "STEPS", value: String(steps.length) },
					{
						caption: "DIMENSIONS",
						value: `${resultImg.width} × ${resultImg.height} px`,
					},
					{ caption: "FORMAT", value: "PNG-24" },
				]
			: [],
	);
</script>

<svelte:head>
	<title>easy-png-tools / {firstTool?.title ?? "Tool"}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#snippet control(
	p: ParamDef,
	value: ParamValue,
	onInput: (v: ParamValue) => void,
)}
	{#if p.type === "color"}
		<ColorField
			label={p.label}
			value={value as string}
			oninput={(v) => onInput(v)}
		/>
	{:else if p.type === "slider"}
		<SliderField
			label={p.label}
			value={value as number}
			min={p.min}
			max={p.max}
			step={p.step}
			oninput={(v) => onInput(v)}
		/>
	{:else if p.type === "select"}
		<SelectField
			label={p.label}
			value={value as string}
			options={p.options}
			onchange={(v) => onInput(v)}
		/>
	{:else if p.type === "checkbox"}
		<label class="toggle-row"
			><span>{p.label}</span>
			<Toggle checked={value as boolean} onchange={(v) => onInput(v)} /></label
		>
	{:else if p.type === "text"}
		<TextField
			label={p.label}
			value={value as string}
			placeholder={p.placeholder}
			oninput={(v) => onInput(v)}
		/>
	{:else if p.type === "number"}
		<NumberField
			label={p.label}
			value={value as number}
			min={p.min}
			max={p.max}
			step={p.step}
			oninput={(v) => onInput(v)}
		/>
	{/if}
{/snippet}

{#if !firstTool}
	<div class="tool-grid">
		<EmptyState
			title="Tool not found"
			description="No tool is registered under “{data.id}”."
			icon={ToolIcon}
		/>
	</div>
{:else}
	<div class="tool-grid">
		<section class="pipeline-panel">
			<Panel>
				<PanelHeading title="Pipeline" eyebrow="STEPS">
					{#snippet actions()}
						<Badge tone="accent">AUTO</Badge>
					{/snippet}
				</PanelHeading>
				<div class="pipeline-body">
					{#if steps.length === 0}
						<EmptyState
							title="Pipeline empty"
							description="Add a tool step below."
						/>
					{/if}
					{#each steps as step, i (step.toolId + i)}
						{@const st = getTool(step.toolId)}
						<StepCard
							index={i + 1}
							title={st?.title ?? step.toolId}
							type={st?.category}
							onremove={() => removeStep(i)}
						>
							{#if st}
								<div class="step-controls">
									{#each st.params as p (p.id)}
										{@render control(p, step.params[p.id] as ParamValue, (v) =>
											setStepParam(i, p.id, v),
										)}
									{/each}
								</div>
							{/if}
						</StepCard>
					{/each}
				</div>
				<SettingsFooter>
					<div class="add-step">
						<SelectField
							label="Add step"
							value={addId}
							options={chainOptions}
							onchange={(v) => (addId = v)}
						/>
						<Button variant="ghost" onclick={addStep}>Add step</Button>
					</div>
				</SettingsFooter>
			</Panel>
		</section>

		<section class="preview-panel">
			<Panel>
				<PanelHeading title="Pipeline output" eyebrow="RESULT">
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
					{#if chainError}
						<EmptyState title="Pipeline failed" description={chainError} />
					{/if}
					{#if needsSource && !sourceImg}
						<Dropzone onfile={onFile} />
					{:else if needsSource && sourceImg}
						<Button variant="ghost" onclick={clearSource}>Change image</Button>
					{/if}
					<div class="preview-stack">
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
					</div>
					{#if processing}
						<StatusLine label="processing pipeline" />
					{/if}
					<MetaList items={resultMeta} />
				</div>
			</Panel>
		</section>
	</div>
{/if}

<style>
	.tool-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
		align-items: start;
		gap: 40px;
		max-width: 1680px;
		margin: 0 auto;
		padding: 48px clamp(24px, 4vw, 72px) 72px;
	}
	.pipeline-body {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0.75rem;
	}
	.step-controls {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
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
	.add-step {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		width: 100%;
	}
	.add-step :global(.select-field),
	.add-step :global(select) {
		min-width: 0;
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
	.preview-stack {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.tile-img {
		max-width: 100%;
		max-height: 220px;
		display: block;
		border-radius: var(--radius);
	}
	@media (max-width: 900px) {
		.tool-grid {
			grid-template-columns: 1fr;
			gap: 24px;
			padding: 32px 16px 48px;
		}
		.preview-panel {
			position: static;
		}
	}
</style>
