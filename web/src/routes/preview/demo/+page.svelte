<script lang="ts">
	import Badge from "$lib/components/kit/Badge.svelte";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import FieldGrid from "$lib/components/kit/FieldGrid.svelte";
	import IconButton from "$lib/components/kit/IconButton.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import PageGrid from "$lib/components/kit/PageGrid.svelte";
	import PipelineFooter from "$lib/components/kit/PipelineFooter.svelte";
	import PreviewStack from "$lib/components/kit/PreviewStack.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import SectionLabel from "$lib/components/kit/SectionLabel.svelte";
	import Segmented from "$lib/components/kit/Segmented.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import StepCard from "$lib/components/kit/StepCard.svelte";
	import ToggleRow from "$lib/components/kit/ToggleRow.svelte";
	import {
		ChevronDown,
		Plus,
		Settings2,
		SlidersHorizontal,
	} from "@lucide/svelte";
	import WorkspaceHeader from "./WorkspaceHeader.svelte";

	let gradColor = $state("#DCEBFF");
	let direction = $state(135);
	let opacity = $state("100");
	let outlineWidth = $state(2);
	let outlineColor = $state("#16202B");
	let radius = $state(18);
	let preserveAspect = $state(true);

	const previewTiles = [
		{ label: "SOURCE", caption: "original.png · 1200 × 800", bg: "#8d9aa5" },
		{
			label: "STEP 01",
			caption: "gradient applied",
			bg: "linear-gradient(135deg, #DCEBFF, #8BC8F5)",
		},
		{
			label: "STEP 02",
			caption: "background removed",
			bg: "linear-gradient(135deg, #DCEBFF, #8BC8F5)",
		},
		{
			label: "STEP 03",
			caption: "outline added",
			bg: "linear-gradient(135deg, #DCEBFF, #8BC8F5)",
			ring: "0 0 0 2px #16202B",
		},
		{
			label: "FINAL OUTPUT",
			caption: "ready · PNG-24",
			bg: "linear-gradient(135deg, #DCEBFF, #8BC8F5)",
			radius: "18px",
			ring: "0 0 0 2px #16202B",
			active: true,
		},
	];
</script>

<svelte:head>
	<title>easy-png-tools / Demo</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<PageGrid>
	{#snippet settings()}
		<WorkspaceHeader
			eyebrowA="PNG PROCESSING"
			eyebrowB="WORKSPACE"
			title="Build your image pipeline."
			lede="Chain simple tools together. Every change is processed automatically and previewed at each stage."
			file={{ name: "source.png", size: "1.8 MB" }}
		/>

		<SectionLabel
			label="PROCESSING PIPELINE"
			title="4 active steps"
			meta="• LIVE"
			unwrapActions
		>
			{#snippet actions()}
				<button class="add-btn" onclick={() => {}}
					><Plus size={15} /> Add tool</button
				>
			{/snippet}
		</SectionLabel>

		<div class="steps-list">
			<StepCard
				index={1}
				type="BACKGROUND"
				title="Gradient background"
				onremove={() => {}}
			>
				{#snippet tools()}
					<Badge tone="success" check>AUTO</Badge>
				{/snippet}
				<FieldGrid>
					<ColorField label="COLOR" chevron bind:value={gradColor} />
					<SliderField
						label="DIRECTION"
						bind:value={direction}
						min={0}
						max={360}
						suffix=" °"
					/>
					<div class="control-block">
						<label>OPACITY <output>{opacity}%</output></label>
						<Segmented
							bind:value={opacity}
							options={[
								{ value: "100", label: "100" },
								{ value: "75", label: "75" },
								{ value: "50", label: "50" },
								{ value: "25", label: "25" },
							]}
						/>
					</div>
				</FieldGrid>
			</StepCard>

			<StepCard
				index={2}
				type="TRANSFORM"
				title="Remove background"
				onremove={() => {}}
			>
				{#snippet tools()}
					<Badge tone="success" check>AUTO</Badge>
				{/snippet}
				<div class="transform-note">
					<SlidersHorizontal size={15} /> Automatic subject detection enabled
				</div>
			</StepCard>

			<StepCard index={3} type="STYLE" title="Add outline" onremove={() => {}}>
				{#snippet tools()}
					<Badge tone="success" check>AUTO</Badge>
				{/snippet}
				<FieldGrid compact>
					<SliderField
						label="WIDTH"
						bind:value={outlineWidth}
						min={0}
						max={8}
						suffix=" px"
					/>
					<ColorField label="COLOR" dark bind:value={outlineColor} />
				</FieldGrid>
			</StepCard>

			<StepCard
				index={4}
				type="STYLE"
				title="Round corners"
				onremove={() => {}}
			>
				{#snippet tools()}
					<Badge tone="success" check>AUTO</Badge>
				{/snippet}
				<FieldGrid compact>
					<SliderField
						label="RADIUS"
						bind:value={radius}
						min={0}
						max={48}
						suffix=" px"
					/>
					<ToggleRow
						label="Preserve aspect ratio"
						bind:checked={preserveAspect}
					/>
				</FieldGrid>
			</StepCard>
		</div>

		<PipelineFooter onreset={() => {}} />
	{/snippet}

	{#snippet preview()}
		<section class="preview-panel">
			<SectionLabel label="PIPELINE OUTPUTS" title="Visual history">
				{#snippet actions()}
					<button class="history-toggle" onclick={() => {}}>
						Hide intermediate <ChevronDown size={15} />
					</button>
					<DownloadButton label="Download result" onclick={() => {}} />
					<MetaList
						items={[
							{ caption: "DIMENSIONS", value: "1200 × 800 px" },
							{ caption: "FORMAT", value: "PNG-24" },
							{ caption: "SIZE", value: "1.2 MB" },
						]}
					/>
					<IconButton
						icon={Settings2}
						label="Preview settings"
						onclick={() => {}}
					/>
				{/snippet}
			</SectionLabel>

			<PreviewStack pad="16px 0">
				{#each previewTiles as tile (tile.label)}
					<PreviewTile label={tile.label} caption={tile.caption}>
						<div
							class="image-preview"
							class:active={tile.active}
							style="background:{tile.bg}; border-radius:{tile.radius ??
								'0'}; box-shadow:{tile.ring ?? 'none'};"
						>
							<span class="sample-icon">PNG</span>
							<span>easy-png-tools</span>
						</div>
					</PreviewTile>
				{/each}
			</PreviewStack>

			<p class="preview-note">
				Output is generated in-browser. Your files never leave this device.
			</p>
		</section>
	{/snippet}
</PageGrid>

<style>
	.add-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--blue);
		background: none;
		border: 0;
		font-size: 12px;
		cursor: pointer;
	}
	.steps-list {
		display: grid;
		gap: 10px;
		padding-top: 14px;
	}
	.control-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.transform-note {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
		font: 11px var(--font-mono);
	}
	.preview-panel {
		min-width: 0;
		margin-top: 0;
		border: 1px solid var(--line);
		background: var(--panel);
		align-self: start;
		padding: 18px;
		position: sticky;
		top: 24px;
	}
	.history-toggle {
		border: 1px solid var(--line);
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.04em;
		background: 0 0;
		justify-content: center;
		align-items: center;
		gap: 8px;
		display: flex;
		width: auto;
		margin: 0;
		padding: 8px 10px;
		& :global(svg) {
			transform: rotate(180deg);
		}
	}
	.history-toggle:hover {
		color: var(--foreground);
		background: var(--background);
	}
	.image-preview {
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		aspect-ratio: 1.5;
		color: #16202b;
		width: 80%;
		font: 600 10px var(--font-mono);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		display: flex;
	}
	.image-preview.active {
		border-color: var(--blue);
	}
	.sample-icon {
		border: 1px solid;
		padding: 3px 5px;
		font-size: 9px;
	}
	.preview-note {
		margin: 12px 0 0;
		color: var(--muted);
		font-size: 11px;
		line-height: 1.5;
	}
</style>
