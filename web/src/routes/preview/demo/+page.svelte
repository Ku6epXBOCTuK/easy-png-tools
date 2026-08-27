<script lang="ts">
	import {
		CircleHelp,
		Moon,
		Upload,
		Settings2,
		RotateCcw,
		ChevronDown,
	} from "@lucide/svelte";
	import StepCard from "$lib/components/kit/StepCard.svelte";
	import Segmented from "$lib/components/kit/Segmented.svelte";
	import SliderField from "$lib/components/kit/SliderField.svelte";
	import ColorField from "$lib/components/kit/ColorField.svelte";
	import Toggle from "$lib/components/kit/Toggle.svelte";
	import IconButton from "$lib/components/kit/IconButton.svelte";
	import DownloadButton from "$lib/components/kit/DownloadButton.svelte";
	import Badge from "$lib/components/kit/Badge.svelte";
	import StatusDot from "$lib/components/kit/StatusDot.svelte";
	import MonoLabel from "$lib/components/kit/MonoLabel.svelte";
	import MetaList from "$lib/components/kit/MetaList.svelte";
	import PreviewTile from "$lib/components/kit/PreviewTile.svelte";
	import CheckerCanvas from "$lib/components/kit/CheckerCanvas.svelte";

	let gradColor = $state("#DCEBFF");
	let direction = $state(135);
	let opacity = $state("100");
	let outlineWidth = $state(2);
	let outlineColor = $state("#16202B");
	let radius = $state(18);
	let preserveAspect = $state(true);
	let lang = $state("RU");

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

<div class="topbar">
	<div class="brand">
		<span class="brand-mark">EP</span>
		<span>easy-png-tools</span>
		<span class="version">/ DEMO</span>
	</div>
	<div class="top-actions">
		<span class="status"><StatusDot /> AUTO PIPELINE</span>
		<IconButton icon={CircleHelp} label="Help" onclick={() => {}} />
		<IconButton icon={Moon} label="Toggle theme" onclick={() => {}} />
		<div class="language">
			<Segmented
				bind:value={lang}
				options={[
					{ value: "RU", label: "RU" },
					{ value: "EN", label: "EN" },
				]}
			/>
		</div>
	</div>
</div>

<div class="page-grid">
	<section class="workspace">
		<div class="eyebrow">PNG PROCESSING <span>/</span> WORKSPACE</div>
		<div class="title-row">
			<div>
				<h1>Build your image pipeline.</h1>
				<p class="lede">
					Chain simple tools together. Every change is processed automatically
					and previewed at each stage.
				</p>
			</div>
			<div class="file-chip">
				<Upload size={15} />
				<span>source.png</span>
				<b>1.8 MB</b>
			</div>
		</div>

		<div class="pipeline-head">
			<div>
				<span class="label">PROCESSING PIPELINE</span>
				<strong>4 active steps <em>• LIVE</em></strong>
			</div>
			<button class="add-btn" onclick={() => {}}>+ Add tool</button>
		</div>

		<div class="steps-list">
			<StepCard
				index={1}
				type="BACKGROUND"
				title="Gradient background"
				onremove={() => {}}
			>
				<div class="step-tools"><Badge tone="success">AUTO</Badge></div>
				<div class="controls">
					<div class="control-block">
						<MonoLabel>COLOR</MonoLabel>
						<ColorField label="Gradient color" bind:value={gradColor} />
					</div>
					<SliderField
						label="DIRECTION"
						bind:value={direction}
						min={0}
						max={360}
						suffix="°"
					/>
					<div class="control-block">
						<MonoLabel>OPACITY</MonoLabel>
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
				</div>
			</StepCard>

			<StepCard
				index={2}
				type="TRANSFORM"
				title="Remove background"
				onremove={() => {}}
			>
				<div class="step-tools"><Badge tone="success">AUTO</Badge></div>
				<div class="transform-note">Automatic subject detection enabled</div>
			</StepCard>

			<StepCard index={3} type="STYLE" title="Add outline" onremove={() => {}}>
				<div class="step-tools"><Badge tone="success">AUTO</Badge></div>
				<div class="controls compact">
					<div class="control-block">
						<MonoLabel>WIDTH</MonoLabel>
						<SliderField
							label="Outline width"
							bind:value={outlineWidth}
							min={0}
							max={8}
							suffix="px"
						/>
					</div>
					<div class="control-block">
						<MonoLabel>COLOR</MonoLabel>
						<ColorField label="Outline color" bind:value={outlineColor} />
					</div>
				</div>
			</StepCard>

			<StepCard
				index={4}
				type="STYLE"
				title="Round corners"
				onremove={() => {}}
			>
				<div class="step-tools"><Badge tone="success">AUTO</Badge></div>
				<div class="controls compact">
					<div class="control-block">
						<MonoLabel>RADIUS</MonoLabel>
						<SliderField
							label="Corner radius"
							bind:value={radius}
							min={0}
							max={48}
							suffix="px"
						/>
					</div>
					<label class="toggle-row">
						<span>Preserve aspect ratio</span>
						<Toggle
							bind:checked={preserveAspect}
							label="Preserve aspect ratio"
						/>
					</label>
				</div>
			</StepCard>
		</div>

		<div class="pipeline-footer">
			<button class="reset-btn" onclick={() => {}}>
				<RotateCcw size={14} /> Reset pipeline
			</button>
			<span class="auto-note"
				><StatusDot /> changes are applied automatically</span
			>
		</div>
	</section>

	<section class="preview-panel">
		<div class="preview-top">
			<div>
				<span class="label">PIPELINE OUTPUTS</span>
				<strong>Visual history</strong>
			</div>
			<div class="preview-actions">
				<button class="history-toggle" onclick={() => {}}>
					Hide intermediate <ChevronDown size={15} />
				</button>
				<DownloadButton
					label="Download result"
					size="1.2 MB"
					onclick={() => {}}
				/>
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
			</div>
		</div>

		<div class="preview-stack">
			{#each previewTiles as tile (tile.label)}
				<PreviewTile label={tile.label}>
					<CheckerCanvas size="large">
						<div
							class="ph"
							class:active={tile.active}
							style="background:{tile.bg}; border-radius:{tile.radius ??
								'0'}; box-shadow:{tile.ring ?? 'none'};"
						>
							<span class="sample-icon">PNG</span>
							<span>easy-png-tools</span>
						</div>
					</CheckerCanvas>
					<div class="tile-label-wrap">
						<span class="tile-label">{tile.label}</span>
						<span class="tile-caption">{tile.caption}</span>
					</div>
				</PreviewTile>
			{/each}
		</div>

		<p class="preview-note">
			Output is generated in-browser. Your files never leave this device.
		</p>
	</section>
</div>

<style>
	.topbar {
		border-bottom: 1px solid var(--line);
		background: var(--panel);
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		padding: 0 clamp(20px, 4vw, 64px);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font: 600 14px var(--font-mono);
	}
	.brand-mark {
		background: var(--blue);
		color: #fff;
		width: 30px;
		height: 30px;
		font-size: 11px;
		display: grid;
		place-items: center;
	}
	.version {
		color: var(--blue);
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
	}
	.top-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
	}
	.language :global(.segmented) {
		height: 32px;
	}
	.page-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(520px, 0.95fr);
		align-items: start;
		gap: 56px;
		max-width: 1680px;
		margin: 0 auto;
		padding: 60px clamp(24px, 4vw, 72px) 72px;
	}
	.workspace {
		min-width: 0;
	}
	.eyebrow {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--muted);
		margin-bottom: 18px;
	}
	.eyebrow span {
		margin: 0 7px;
		color: var(--blue);
	}
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 30px;
		margin-bottom: 56px;
	}
	h1 {
		margin: 0 0 16px;
		font-size: clamp(36px, 4vw, 64px);
		font-weight: 650;
		letter-spacing: -0.06em;
		color: var(--foreground);
	}
	.lede {
		margin: 0;
		max-width: 550px;
		color: var(--muted);
		line-height: 1.6;
	}
	.file-chip {
		display: flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
		border: 1px solid var(--line);
		background: var(--panel);
		font: 11px var(--font-mono);
		color: var(--muted);
		padding: 10px 12px;
	}
	.file-chip b {
		color: var(--blue);
		font-weight: 500;
	}
	.pipeline-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--line);
		padding-bottom: 12px;
	}
	.label {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--muted);
	}
	.pipeline-head strong {
		display: block;
		margin-top: 5px;
		font: 600 14px var(--font-mono);
		color: var(--foreground);
	}
	.pipeline-head em {
		color: #25a96a;
		font-style: normal;
		font-size: 10px;
	}
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
	.step-tools {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.controls {
		display: grid;
		grid-template-columns: 1.1fr 1fr 1.2fr;
		gap: 16px;
	}
	.controls.compact {
		grid-template-columns: 1fr 1fr;
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
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		color: var(--foreground);
		font-size: 0.85rem;
		cursor: pointer;
	}
	.pipeline-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 18px;
	}
	.reset-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--blue);
		background: none;
		border: 0;
		cursor: pointer;
		font-size: 12px;
	}
	.auto-note {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
		font: 11px var(--font-mono);
	}
	.preview-panel {
		position: sticky;
		top: 24px;
		border: 1px solid var(--line);
		background: var(--panel);
		padding: 18px;
		min-width: 0;
	}
	.preview-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--line);
		padding-bottom: 15px;
		gap: 16px;
	}
	.preview-top strong {
		display: block;
		margin-top: 5px;
		font: 600 14px var(--font-mono);
	}
	.preview-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}
	.history-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		margin-top: 18px;
		border: 1px solid var(--line);
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.04em;
		background: none;
		padding: 11px 14px;
		cursor: pointer;
	}
	.history-toggle:hover {
		color: var(--foreground);
		background: var(--background);
	}
	.preview-stack {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding: 16px 0;
	}
	.ph {
		width: 80%;
		aspect-ratio: 1.35;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		color: #16202b;
		font: 600 10px var(--font-mono);
	}
	.ph.active {
		border-color: var(--blue);
	}
	.sample-icon {
		border: 1px solid;
		padding: 3px 5px;
		font-size: 9px;
	}
	.tile-label-wrap {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding: 8px;
		border-top: 1px solid var(--line);
		font: 9px var(--font-mono);
		color: var(--blue);
	}
	.tile-caption {
		color: var(--muted);
		font-weight: 400;
		text-align: right;
	}
	.preview-note {
		margin: 12px 0 0;
		color: var(--muted);
		font-size: 11px;
		line-height: 1.5;
	}
	@media (max-width: 800px) {
		.page-grid {
			grid-template-columns: 1fr;
			gap: 24px;
			padding: 36px 16px 48px;
		}
		.title-row {
			flex-direction: column;
			align-items: flex-start;
		}
		.preview-panel {
			position: static;
		}
		.controls,
		.controls.compact {
			grid-template-columns: 1fr;
		}
		.preview-stack {
			grid-template-columns: 1fr;
		}
	}
</style>
