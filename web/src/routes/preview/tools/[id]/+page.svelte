<script lang="ts">
	import { browser } from "$app/environment";
	import { untrack } from "svelte";
	import {
		getTool,
		defaultParams,
		isChainable,
		TOOLS,
	} from "$lib/registry";
	import { encode, downloadBlob, toDataUrl, decodeBytes } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import WorkspaceLayout from "$lib/components/kit/WorkspaceLayout.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import { SlidersHorizontal as ToolIcon } from "@lucide/svelte";
	import SettingsPanel from "./SettingsPanel.svelte";
	import PreviewPanel from "./PreviewPanel.svelte";

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

{#if !firstTool}
	<div class="notfound">
		<EmptyState
			title="Tool not found"
			description="No tool is registered under “{data.id}”."
			icon={ToolIcon}
		/>
	</div>
{:else}
	<WorkspaceLayout
		columns="minmax(0, 1fr) minmax(0, 1.1fr)"
		gap="40px"
		padding="48px clamp(24px, 4vw, 72px) 72px"
		maxWidth="1680px"
		stickyTop="84px"
		padMobile="32px 16px 48px"
	>
		{#snippet settings()}
			<SettingsPanel
				{steps}
				{chainOptions}
				{addId}
				onAddStep={addStep}
				onSetAddId={(v) => (addId = v)}
				onRemoveStep={removeStep}
				onSetParam={setStepParam}
			/>
		{/snippet}
		{#snippet preview()}
			<PreviewPanel
				{needsSource}
				{sourceImg}
				{sourceUrl}
				{stepOutputs}
				{resultUrl}
				{resultMeta}
				{processing}
				{chainError}
				onFile={onFile}
				onClearSource={clearSource}
				onDownload={downloadResult}
			/>
		{/snippet}
	</WorkspaceLayout>
{/if}

<style>
	.notfound {
		max-width: 1680px;
		margin: 0 auto;
		padding: 48px clamp(24px, 4vw, 72px) 72px;
	}
</style>
