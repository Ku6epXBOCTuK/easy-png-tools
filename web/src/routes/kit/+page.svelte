<script lang="ts">
	import CheckerCanvas from "$lib/components/CheckerCanvas.svelte";
	import CodeBlock from "$lib/components/CodeBlock.svelte";
	import EmptyState from "$lib/components/EmptyState.svelte";
	import CheckboxField from "$lib/components/fields/CheckboxField.svelte";
	import ColorField from "$lib/components/fields/ColorField.svelte";
	import SelectField from "$lib/components/fields/SelectField.svelte";
	import SliderField from "$lib/components/fields/SliderField.svelte";
	import TextField from "$lib/components/fields/TextField.svelte";
	import ImageCard from "$lib/components/ImageCard.svelte";
	import Panel from "$lib/components/layout/Panel.svelte";
	import MetaList from "$lib/components/MetaList.svelte";
	import SettingGroup from "$lib/components/SettingGroup.svelte";
	import SettingsFooter from "$lib/components/SettingsFooter.svelte";
	import StatusLine from "$lib/components/StatusLine.svelte";
	import StepCard from "$lib/components/StepCard.svelte";
	import ToolCard from "$lib/components/ToolCard.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import DownloadButton from "$lib/components/ui/DownloadButton.svelte";
	import IconButton from "$lib/components/ui/IconButton.svelte";
	import Segmented from "$lib/components/ui/Segmented.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import { Download, ImageOff, Plus, Trash2 } from "@lucide/svelte";

	import { TOOL_ICONS } from "$lib/preview/tool-icons";
	import { TOOLS } from "$lib/registry-new";

	let mode = $state("preview");
	let radius = $state(8);
	let tint = $state("#3b82f6");
	let fileName = $state("image.png");
	let format = $state("png");
	let lossless = $state(true);
	let animated = $state(false);

	const showcaseTools = TOOLS.filter((tool) =>
		["linear-gradient-png", "resize-png", "quantize-png"].includes(tool.id),
	);
</script>

<div class="showcase">
	<header class="showcase-head">
		<span class="showcase-eyebrow">KIT SHOWCASE</span>
		<StatusLine label="rendering ok" />
	</header>

	<Panel title="Buttons" eyebrow="controls">
		<div class="stack">
			<SettingGroup label="variants">
				<Button onclick={() => {}} label="Primary" />
				<Button variant="outline" onclick={() => {}} label="Outline" />
				<Button variant="accent" onclick={() => {}} label="Accent" />
				<Button variant="danger" onclick={() => {}} label="Danger" />
			</SettingGroup>
			<SettingGroup label="states">
				<Button disabled onclick={() => {}} label="Disabled" />
				<IconButton icon={Plus} label="Add" onclick={() => {}} />
				<IconButton
					icon={Trash2}
					label="Delete"
					variant="primary"
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

	<Panel title="Inputs" eyebrow="controls">
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

	<Panel title="Segmented & badges" eyebrow="controls">
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

	<Panel title="Steps" eyebrow="pipeline">
		<div class="stack">
			<StepCard index={1} type="BACKGROUND" title="Gradient fill">
				<ColorField label="color" bind:value={tint} />
			</StepCard>
			<StepCard index={2} type="TRANSFORM" title="Resize" onremove={() => {}}>
				<SliderField label="scale" bind:value={radius} suffix="%" />
			</StepCard>
		</div>
	</Panel>

	<Panel title="Tools" eyebrow="catalog">
		<div class="tool-grid">
			{#each showcaseTools as tool, i (tool.id)}
				<ToolCard
					title={tool.title}
					id={tool.id}
					description={tool.description}
					index={i + 1}
					icon={TOOL_ICONS[tool.id]}
				/>
			{/each}
		</div>
	</Panel>

	<Panel title="Preview" eyebrow="canvas">
		<div class="preview-grid">
			<ImageCard label="result.png · 512×512">
				<CheckerCanvas size="sm" />
			</ImageCard>
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

	<Panel title="States & code" eyebrow="misc">
		<div class="stack">
			<EmptyState
				icon={ImageOff}
				title="No image loaded"
				description="Drop a PNG to start processing"
			>
				<Button onclick={() => {}} label="Open file" />
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
		padding: var(--space-page-top)
			clamp(var(--space-xxl), 4vw, var(--space-page-bottom))
			var(--space-page-bottom);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}
	.showcase-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.showcase-eyebrow {
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-2xl);
		color: var(--color-text-muted);
	}
	.stack {
		display: flex;
		flex-direction: column;
	}
	.tool-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--size-card-min), 1fr));
		gap: var(--space-l);
		padding: var(--space-l) var(--space-xl);
	}
	.preview-grid {
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(var(--size-card-min-narrow), 1fr)
		);
		gap: var(--space-l);
		padding: var(--space-l) var(--space-xl);
	}
</style>
