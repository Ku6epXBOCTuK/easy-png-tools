<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import { ButtonVariantDefine } from "$lib/components/ui/define";
	import { isFav, toggleFav } from "$lib/favorites.svelte";
	import { Star } from "@lucide/svelte";
	import { DragDropProvider } from "@dnd-kit/svelte";
	import { debounce } from "$lib/core/debounce";
	import { toDataUrl } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import {
		chainStepTitle,
		chainWarningText,
		pageDescription,
		pageTitle,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { moveStep, type ChainStep } from "$lib/pipeline.svelte";
	import { getTool, type Page, type Tool } from "$lib/registry";
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import AddStepButton from "./AddStepButton.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaFields from "./SchemaFields.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import SortableStepCard from "./SortableStepCard.svelte";
	import StepReorderOverlay from "./StepReorderOverlay.svelte";
	import ToolPickerButton from "./ToolPickerButton.svelte";
	import { createChainHost } from "./chain-host.svelte";
	import { createOutputControls } from "./output-controls.svelte";
	import { hasPreviewResult } from "./schema-preview-model";
	import { createSchemaToolRunner } from "./schema-tool-runner.svelte";
	import {
		createSchemaToolState,
		toolSchemaOf,
	} from "./schema-tool-state.svelte";
	import { createSourceUpload } from "./source-upload.svelte";
	import { createStepDnd } from "./step-dnd.svelte";
	import { createStepMasks } from "./step-mask.svelte";

	interface Props {
		page: Page;
		tool: Tool;
		/** Named-chain mode: the chain id and display name; page is virtual. */
		chainId?: string;
	}
	let { page, tool, chainId = undefined }: Props = $props();

	const schema = $derived(tool.schema);

	const inputMode = $derived(tool.input);

	let aligned = $state(false);

	// Composition root: feature state lives in sibling composables
	// (source-upload, output-controls, step-mask, chain-host); execution in
	// schema-tool-runner, step state in schema-tool-state.
	const upload = createSourceUpload({
		inputMode: () => inputMode,
		steps: () => stepState.steps,
		setSteps: (v) => (stepState.steps = v),
		touchedFor: (key) => stepState.touchedFor(key),
		reportError: (e) => runner.reportError(e),
		clearError: () => (runner.displayError = null),
	});

	const stepState = createSchemaToolState({
		source: () => upload.source,
		stepDims: () => runner.stepDims,
		clearResults: () => runner.clearResults(),
	});
	const {
		setStepValue,
		resetStep,
		addStepAt,
		removeStepAt,
		toggleStep,
		replaceStepTool,
	} = stepState;
	const steps = $derived(stepState.steps);
	const stepDnd = createStepDnd({
		onMove: (from, to) => {
			stepState.steps = moveStep(stepState.steps, from, to);
		},
	});

	const lastTool = $derived(
		(steps.length > 0 ? getTool(steps[steps.length - 1].id) : undefined) ??
			tool,
	);

	const output = createOutputControls({
		lastTool: () => lastTool,
		steps: () => steps,
		result: () => runner.result,
		setStepValue,
	});

	const runner = createSchemaToolRunner({
		pageSlug: () => page.slug,
		schema: () => schema,
		steps: () => steps,
		source: () => upload.source,
		sourceFiles: () => upload.sourceFiles,
		textSource: () => upload.textSource,
		format: () => output.format,
		quality: () => output.quality,
		limitKb: () => output.limitKb,
		lastTool: () => lastTool,
	});
	const { run, download, copyText, downloadText } = runner;
	const running = $derived(runner.running);
	// Display-level busy: either a run or a download is in flight.
	const busy = $derived(running || runner.downloading);
	const result = $derived(runner.result);
	const fileResult = $derived(runner.fileResult);
	const textResult = $derived(runner.textResult);
	const verdictVars = $derived(runner.verdictVars);
	const stepDims = $derived(runner.stepDims);
	const stepResults = $derived(runner.stepResults);
	const stepFileSets = $derived(runner.stepFileSets);
	const runWarnings = $derived(runner.runWarnings);
	const displayError = $derived(runner.displayError);
	const allWarnings = $derived([...upload.sourceWarnings, ...runWarnings]);

	const masks = createStepMasks({
		steps: () => steps,
		source: () => upload.source,
		stepResults: () => runner.stepResults,
	});

	const host = createChainHost({
		page: () => page,
		chainId: () => chainId,
		schema: () => schema,
		lastTool: () => lastTool,
		steps: () => steps,
		stepState,
		source: upload,
		output,
		resetRun: () => runner.resetForHost(),
		clearMasks: () => masks.clear(),
	});

	const resultKind = $derived(lastTool.result ?? "image");
	// Display kind follows the actual output: a batch run of an image tool
	// produces a file set, not a single image.
	const displayResultKind = $derived(fileResult ? "files" : resultKind);
	// Chain can be extended while the last step outputs images (one or many).
	const canExtend = $derived(
		["image", "files"].includes(lastTool.result ?? "image"),
	);
	const alignedMode = $derived(
		aligned && resultKind === "image" && steps.length > 1,
	);
	const hasResult = $derived(
		hasPreviewResult({
			inputMode,
			resultKind: displayResultKind,
			result,
			fileResult,
			textResult,
		}),
	);

	const lastParams = $derived(steps.at(-1)?.params);
	const resultNote = $derived(
		result && lastTool.resultNote
			? lastTool.resultNote(lastParams ?? {}, result)
			: null,
	);

	const errorText = $derived.by(() => {
		const current = displayError;
		if (!current) return "";
		return current.kind === "i18n"
			? t(current.key, current.vars)
			: current.text;
	});

	const debouncedRun = debounce(() => run(), 200);

	$effect(() => {
		if (!host.inited) return;
		if (inputMode === "image" && !upload.source) return;
		if (inputMode === "text" && !upload.textSource.trim()) return;
		void steps;
		void upload.source;
		debouncedRun();
		return () => debouncedRun.cancel();
	});

	function stepTitle(toolId: string): string {
		return chainStepTitle(toolId);
	}
</script>

{#if schema}
	<div class="schema-tool">
		<header class="header">
			<div class="title-block">
				<h1>
					{pageTitle(page)}
					{#if !chainId}
						<button
							type="button"
							class="tool-fav"
							class:active={isFav(page.slug)}
							aria-label={isFav(page.slug) ? t("ui.removeFav") : t("ui.addFav")}
							aria-pressed={isFav(page.slug)}
							onclick={() => toggleFav(page.slug)}
						>
							<Star
								size={18}
								fill={isFav(page.slug) ? "currentColor" : "none"}
							/>
						</button>
					{/if}
				</h1>
				{#if pageDescription(page)}
					<p class="lede">{pageDescription(page)}</p>
				{/if}
			</div>
			{#if !chainId}
				<Button
					label={t("savedChains.saveAs")}
					variant={ButtonVariantDefine.OUTLINE}
					size="s"
					onclick={host.saveAsChain}
				/>
			{/if}
		</header>

		{#snippet stepCard(step: ChainStep, i: number)}
			<SortableStepCard
				{step}
				index={i}
				title={stepTitle(step.id)}
				collapsed={step.collapsed ?? false}
				ontoggle={() => toggleStep(i)}
				onremove={steps.length > 1 ? () => removeStepAt(step.key) : undefined}
			>
				{#snippet tools()}
					<ToolPickerButton
						label={t("chain.changeTool")}
						iconOnly
						onadd={(id) => replaceStepTool(i, id)}
					/>
				{/snippet}
				{@const stepSchema = toolSchemaOf(step)}
				{#if stepSchema}
					<SchemaFields
						schema={stepSchema}
						values={step.params}
						toolId={step.id}
						sourceDims={i === 0
							? (upload.source ?? undefined)
							: stepDims[i - 1]}
						onchange={(id, v, axis) => setStepValue(i, id, v, axis)}
						onreset={() => resetStep(i)}
					/>
				{/if}
			</SortableStepCard>
		{/snippet}

		{#snippet maskChip(i: number)}
			{#if masks.maskable[i]}
				<ChipButton
					label={t("resultCard.maskToggle")}
					active={masks.maskOn[i] ?? false}
					onclick={() => masks.toggleByIndex(i)}
				/>
			{/if}
		{/snippet}

		{#snippet inputTile(i: number)}
			{#if i === 0}
				<SchemaSourceTile
					mode={inputMode}
					source={upload.source}
					sources={upload.sourceFiles}
					textSource={upload.textSource}
					running={busy}
					fileCount={upload.sourceFiles.length}
					ontextinput={(v) => (upload.textSource = v)}
					onrendertext={run}
					onupload={upload.handleFile}
					onuploadmany={upload.handleFiles}
				/>
			{:else}
				{@const input = stepResults[i - 1]}
				{@const inSet = stepFileSets[i - 1] ?? []}
				<PreviewTile
					label={t("chain.inputLegend")}
					viewMode="image"
					dims={input ? `${input.width} × ${input.height}` : undefined}
					parts={inSet.length > 1 ? inSet.length : undefined}
				>
					{#if inSet.length > 1}
						<PartsGrid files={inSet} />
					{:else if input}
						<img src={toDataUrl(input)} alt="" />
					{:else}
						<span class="empty">{t("resultCard.noResult")}</span>
					{/if}
				</PreviewTile>
			{/if}
		{/snippet}

		{#snippet outputTile(i: number)}
			{@const out = stepResults[i]}
			{#if i === steps.length - 1}
				<SchemaResultTile
					resultKind={displayResultKind}
					result={out}
					{resultNote}
					{fileResult}
					{textResult}
					textVars={verdictVars}
					toolId={lastTool.id}
					running={busy}
					mask={masks.masks[i] ?? null}
					maskOn={masks.maskOn[i] ?? false}
					ontogglemask={masks.maskable[i]
						? () => masks.toggleByIndex(i)
						: undefined}
					oncopy={copyText}
					ondownloadtxt={downloadText}
				/>
			{:else}
				{@const outSet = stepFileSets[i] ?? []}
				<PreviewTile
					label={t("chain.stepResult", { n: i + 1 })}
					viewMode="image"
					dims={out ? `${out.width} × ${out.height}` : undefined}
					parts={outSet.length > 1 ? outSet.length : undefined}
				>
					{#snippet actions()}
						{@render maskChip(i)}
					{/snippet}
					{#if outSet.length > 1 && !masks.maskOn[i]}
						<PartsGrid files={outSet} />
					{:else if out}
						<img
							src={toDataUrl(
								masks.maskOn[i] && masks.masks[i]
									? (masks.masks[i] as PixelImage)
									: out,
							)}
							alt=""
						/>
					{:else}
						<span class="empty">{t("resultCard.noResult")}</span>
					{/if}
				</PreviewTile>
			{/if}
		{/snippet}

		{#snippet panelHead()}
			<div class="panel-head">
				<span class="label">{t("resultCard.previewPanel")}</span>
				{#if resultKind === "image" && steps.length > 1}
					<label class="align-toggle">
						<Toggle bind:checked={aligned} label={t("chain.alignToggle")} />
						<span>{t("chain.alignToggle")}</span>
					</label>
				{/if}
				<SchemaActions
					{inputMode}
					resultKind={displayResultKind}
					canDownload={hasResult}
					running={busy}
					format={output.format}
					quality={output.quality}
					limitKb={output.limitKb}
					alphaLoss={output.alphaLoss}
					onupload={upload.handleFile}
					ondownload={download}
					onformat={(v) => (output.format = v)}
					onquality={output.setQuality}
					onlimit={(v) => (output.limitKb = v)}
				/>
			</div>
		{/snippet}

		{#snippet addRow(index: number)}
			{#if canExtend}
				<div class="add-row">
					<AddStepButton onadd={(id) => addStepAt(index, id)} />
					{#if alignedMode}
						<div class="row-bridge" aria-hidden="true"></div>
					{/if}
				</div>
			{/if}
		{/snippet}

		<DragDropProvider
			onDragStart={stepDnd.onDragStart}
			onDragMove={stepDnd.onDragOver}
			onDragOver={stepDnd.onDragOver}
			onDragEnd={stepDnd.onDragEnd}
		>
			{#if alignedMode}
				<div class="workspace aligned">
					<div class="head-spacer" aria-hidden="true"></div>
					{@render panelHead()}
					{@render addRow(0)}
					{#each steps as step, i (step.key)}
						{@render stepCard(step, i)}
						<div class="pair">
							{@render inputTile(i)}
							{@render outputTile(i)}
						</div>
						{@render addRow(i + 1)}
					{/each}
					<div class="panel-foot" aria-hidden="true"></div>
				</div>
			{:else}
				<div class="workspace">
					<section class="settings">
						{@render addRow(0)}
						{#each steps as step, i (step.key)}
							{@render stepCard(step, i)}
							{@render addRow(i + 1)}
						{/each}
					</section>
					<section class="panel">
						{@render panelHead()}
						<div class="pair-grid">
							<div class="cell">{@render inputTile(0)}</div>
							{#each steps as step, i (step.key)}
								<div class="cell">{@render outputTile(i)}</div>
							{/each}
						</div>
					</section>
				</div>
			{/if}
			{#if errorText}
				<p class="error" role="alert">{errorText}</p>
			{/if}
			{#each allWarnings as w (chainWarningText(w))}
				<p class="warn" role="status">{chainWarningText(w)}</p>
			{/each}
			<StepReorderOverlay {steps} dnd={stepDnd} />
		</DragDropProvider>
	</div>
{:else}
	<p class="no-schema">{t("paramsCard.noSchema")}</p>
{/if}

<style>
	.schema-tool {
		padding: calc(var(--space-xxxl) + var(--space-l))
			clamp(var(--space-m), 4vw, var(--space-xxxl));
		flex: 1;
	}
	.header {
		display: flex;
		justify-content: space-between;
		gap: var(--space-l);
		margin-bottom: var(--space-xxxl);
	}
	.title-block h1 {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		margin: var(--space-s) 0 0;
		font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-2xl));
		line-height: 1.1;
		color: var(--color-text);
	}
	.tool-fav {
		display: inline-grid;
		place-items: center;
		padding: var(--space-s);
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.tool-fav:hover,
	.tool-fav.active {
		color: var(--color-warning);
	}
	.lede {
		max-width: 100%;
		margin: var(--space-m) 0 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-s);
		line-height: 1.5;
	}
	/* Two scaffoldings over shared snippets: normal mode keeps two independent
	   columns (cards pack under each other, tiles pack two per row inside one
	   panel); aligned mode is a flat 3-column grid where each card shares its
	   grid row with the input/output pair and the right side reads as one
	   continuous panel. */
	.workspace {
		display: grid;
		grid-template-columns: minmax(var(--size-workspace-min), 1fr) minmax(
				0,
				2fr
			);
		gap: var(--space-xxl);
		align-items: start;
	}
	.settings {
		display: flex;
		flex-direction: column;
	}
	.panel {
		padding: var(--space-xl);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
	}
	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-m);
		padding-bottom: var(--space-l);
		border-bottom: var(--size-border) solid var(--color-border);
		margin-bottom: var(--space-xl);
	}
	.label {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
		color: var(--color-main);
	}
	.align-toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		margin-right: auto;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.pair-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-l);
	}
	.cell {
		min-width: 0;
	}

	/* Aligned mode: cards in column 1, each step's input/output pair spans
	   columns 2-3 on the card's row. The right side forms one panel: head and
	   foot carry the top/bottom borders, pairs and row bridges carry the side
	   borders, so rows have no vertical gaps. */
	.workspace.aligned {
		grid-template-columns: minmax(var(--size-workspace-min), 1fr) 1fr 1fr;
		gap: 0 var(--space-xxl);
	}
	.aligned > :global(.step-card) {
		grid-column: 1;
	}
	.aligned .head-spacer {
		grid-column: 1;
	}
	.aligned .panel-head {
		grid-column: 2 / -1;
		padding: var(--space-l) var(--space-xl);
		border: var(--size-border) solid var(--color-border);
		border-bottom: none;
		border-radius: var(--radius-m) var(--radius-m) 0 0;
		background: var(--color-panel);
		margin-bottom: 0;
	}
	.aligned .pair {
		grid-column: 2 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-l);
		padding: var(--space-xl);
		border-right: var(--size-border) solid var(--color-border);
		border-left: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
	}
	/* The workspace has align-items: start; panel pieces must stretch to the
	   row height or the side borders break when a card is taller than its
	   pair. */
	.aligned .panel-head,
	.aligned .pair,
	.aligned .row-bridge,
	.aligned .panel-foot {
		align-self: stretch;
	}
	.aligned .add-row {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
	}
	.aligned .row-bridge {
		grid-column: 2 / -1;
		border-right: var(--size-border) solid var(--color-border);
		border-left: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
	}
	.aligned .panel-foot {
		grid-column: 2 / -1;
		min-height: var(--space-xl);
		border: var(--size-border) solid var(--color-border);
		border-top: none;
		border-radius: 0 0 var(--radius-m) var(--radius-m);
		background: var(--color-panel);
	}
	.error {
		margin: var(--space-l) 0 0;
		color: var(--color-danger);
		font: var(--font-size-s) var(--font-mono);
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	.no-schema {
		font: var(--font-size-s) var(--font-mono);
	}
	.warn {
		margin: var(--space-s) 0 0;
		color: var(--color-warning);
		font: var(--font-size-s) var(--font-mono);
	}
	@media (--bp-tablet) {
		.workspace,
		.workspace.aligned {
			grid-template-columns: 1fr;
		}
		.pair-grid,
		.aligned .pair {
			grid-template-columns: 1fr;
		}
		.aligned .head-spacer,
		.aligned .row-bridge {
			display: none;
		}
		.aligned .panel-head,
		.aligned .pair,
		.aligned .panel-foot {
			grid-column: 1 / -1;
		}
	}
</style>
