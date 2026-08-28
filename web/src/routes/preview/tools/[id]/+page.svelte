<script lang="ts">
	import { browser } from "$app/environment";
	import { untrack } from "svelte";
	import { getTool, defaultParams } from "$lib/registry";
	import { encode, downloadBlob, toDataUrl } from "$lib/core/io";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import SelectField from "$lib/components/kit/SelectField.svelte";
	import Toggle from "$lib/components/kit/Toggle.svelte";
	import TextField from "$lib/components/kit/TextField.svelte";
	import NumberField from "$lib/components/kit/NumberField.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import Badge from "$lib/components/kit/Badge.svelte";
	import StatusLine from "$lib/components/kit/StatusLine.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
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

	async function download() {
		if (!tool?.generate) return;
		const result = tool.generate({ ...params });
		const img = result instanceof Promise ? await result : result;
		const blob = await encode(img, "image/png");
		downloadBlob(blob, `${tool.id}.png`);
	}

	function setParam(id: string, value: ParamValue) {
		params[id] = value;
	}

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

{#if !tool}
	<div class="tool-grid">
		<EmptyState
			title="Tool not found"
			description="No tool is registered under “{data.id}”."
			icon={ToolIcon}
		/>
	</div>
{:else}
	<div class="tool-grid">
		<section class="settings-panel">
			<Panel>
				<PanelHeading title={tool.title} eyebrow={tool.category}>
					{#snippet actions()}
						<Badge tone="accent">AUTO</Badge>
					{/snippet}
				</PanelHeading>
				<p class="tool-desc">{tool.description}</p>
				<div class="settings-body">
					{#each tool.params as p (p.id)}
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
		</section>

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
						<PreviewTile label="RESULT">
							<CheckerCanvas size="large">
								<img class="result-img" src={previewUrl} alt="result" />
							</CheckerCanvas>
						</PreviewTile>
					{:else if tool.generate}
						<div class="preview-loading">
							<StatusLine label="generating preview" />
						</div>
					{:else}
						<EmptyState
							title="No live preview"
							description="This tool runs on an uploaded image. Source upload arrives in a later step."
							icon={ToolIcon}
						/>
					{/if}
					<MetaList items={meta} />
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
