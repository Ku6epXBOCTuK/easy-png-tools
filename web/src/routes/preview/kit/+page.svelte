<script lang="ts">
	import CheckboxField from "$lib/components/kit/CheckboxField.svelte";
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";
	import CodeBlock from "$lib/components/kit/CodeBlock.svelte";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import IconButton from "$lib/components/kit/IconButton.svelte";
	import ImageCard from "$lib/components/kit/ImageCard.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import Segmented from "$lib/components/kit/Segmented.svelte";
	import SelectField from "$lib/components/kit/SelectField.svelte";
	import SettingGroup from "$lib/components/kit/SettingGroup.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import StatusLine from "$lib/components/kit/StatusLine.svelte";
	import StepCard from "$lib/components/kit/StepCard.svelte";
	import TextField from "$lib/components/kit/TextField.svelte";
	import Toggle from "$lib/components/kit/Toggle.svelte";
	import ToolCard from "$lib/components/kit/ToolCard.svelte";
	import Badge from "$lib/components/kit/ui/Badge.svelte";
	import Button from "$lib/components/kit/ui/Button.svelte";
	import { Download, ImageOff, Palette, Plus, Trash2 } from "@lucide/svelte";

	let mode = $state("preview");
	let radius = $state(8);
	let tint = $state("#3b82f6");
	let fileName = $state("image.png");
	let format = $state("png");
	let lossless = $state(true);
	let animated = $state(false);

	const tools = [
		{
			title: "Gradient",
			href: "#",
			description: "Linear & radial gradients",
		},
		{
			title: "Resize",
			href: "#",
			description: "Pixel-perfect scaling",
		},
		{
			title: "Quantize",
			href: "#",
			description: "Reduce color depth",
		},
	];
</script>

<div class="showcase">
	<header class="showcase-head">
		<span class="showcase-eyebrow">KIT SHOWCASE</span>
		<StatusLine label="rendering ok" />
	</header>

	<Panel>
		<PanelHeading title="Buttons" eyebrow="controls" />
		<div class="stack">
			<SettingGroup label="variants">
				<Button onclick={() => {}}>Primary</Button>
				<Button variant="outline" onclick={() => {}}>Outline</Button>
				<Button variant="accent" onclick={() => {}}>Accent</Button>
				<Button variant="danger" onclick={() => {}}>Danger</Button>
			</SettingGroup>
			<SettingGroup label="states">
				<Button disabled onclick={() => {}}>Disabled</Button>
				<IconButton icon={Plus} label="Add" onclick={() => {}} />
				<IconButton
					icon={Trash2}
					label="Delete"
					variant="solid"
					onclick={() => {}}
				/>
				<IconButton
					icon={Download}
					label="Download"
					disabled
					onclick={() => {}}
				/>
			</SettingGroup>
		</div>
		<SettingsFooter>
			<DownloadButton label="Download PNG" onclick={() => {}} />
		</SettingsFooter>
	</Panel>

	<Panel>
		<PanelHeading title="Inputs" eyebrow="controls" />
		<div class="stack">
			<SliderField
				label="corner radius"
				bind:value={radius}
				min={0}
				max={32}
				suffix="px"
			/>
			<ColorField label="accent tint" bind:value={tint} />
			<TextField
				label="file name"
				bind:value={fileName}
				placeholder="image.png"
			/>
			<SelectField
				label="format"
				bind:value={format}
				options={[
					{ value: "png", label: "PNG" },
					{ value: "webp", label: "WebP" },
					{ value: "avif", label: "AVIF" },
				]}
			/>
			<SettingGroup label="options">
				<CheckboxField label="lossless" bind:checked={lossless} />
				<Toggle bind:checked={animated} label="animate" />
			</SettingGroup>
		</div>
	</Panel>

	<Panel>
		<PanelHeading title="Segmented & badges" eyebrow="controls" />
		<div class="stack">
			<Segmented
				bind:value={mode}
				options={[
					{ value: "preview", label: "Preview" },
					{ value: "compare", label: "Compare" },
					{ value: "code", label: "Code" },
				]}
			/>
			<SettingGroup label="tones">
				<Badge label="default" />
				<Badge tone="accent" label="accent" />
				<Badge tone="success" label="success" />
				<Badge tone="danger" label="default" />
				<Badge tone="warning" label="warning" />
				<Badge tone="info" label="info" />
			</SettingGroup>
		</div>
	</Panel>

	<Panel>
		<PanelHeading title="Steps" eyebrow="pipeline" />
		<div class="stack">
			<StepCard index={1} type="BACKGROUND" title="Gradient fill">
				<ColorField label="color" bind:value={tint} />
			</StepCard>
			<StepCard index={2} type="TRANSFORM" title="Resize" onremove={() => {}}>
				<SliderField label="scale" bind:value={radius} suffix="%" />
			</StepCard>
		</div>
	</Panel>

	<Panel>
		<PanelHeading title="Tools" eyebrow="catalog" />
		<div class="tool-grid">
			{#each tools as tool, i (tool.title)}
				<ToolCard
					title={tool.title}
					href={tool.href}
					description={tool.description}
					index={i + 1}
					icon={Palette}
				/>
			{/each}
		</div>
	</Panel>

	<Panel>
		<PanelHeading title="Preview" eyebrow="canvas" />
		<div class="preview-grid">
			<ImageCard label="result.png · 512×512">
				<CheckerCanvas size="sm" />
			</ImageCard>
			<PreviewTile label="tile-01" caption="caption-01">
				<CheckerCanvas size="sm" />
			</PreviewTile>
			<PreviewTile label="tile-02" caption="caption-01">
				<CheckerCanvas size="sm" />
			</PreviewTile>
		</div>
		<SettingsFooter>
			<MetaList
				items={[
					{ caption: "dimensions", value: "512 × 512" },
					{ caption: "format", value: "PNG" },
					{ caption: "size", value: "48.2 KB" },
				]}
			/>
		</SettingsFooter>
	</Panel>

	<Panel>
		<PanelHeading title="States & code" eyebrow="misc" />
		<div class="stack">
			<EmptyState
				icon={ImageOff}
				title="No image loaded"
				description="Drop a PNG to start processing"
			>
				<Button onclick={() => {}}>Open file</Button>
			</EmptyState>
			<CodeBlock
				code={'export const config = {\n  radius: 8,\n  tint: "#3b82f6",\n};'}
				lang="ts"
				copyable
				oncopy={() => {}}
			/>
		</div>
	</Panel>
</div>

<style>
	.showcase {
		max-width: none;
		margin: 0 auto;
		padding: 2.5rem clamp(24px, 4vw, 72px) 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.showcase-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.showcase-eyebrow {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.18em;
		color: var(--muted);
	}
	.stack {
		display: flex;
		flex-direction: column;
	}
	.tool-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.75rem;
		padding: 0.75rem 1rem;
	}
	.preview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
		padding: 0.75rem 1rem;
	}
</style>
