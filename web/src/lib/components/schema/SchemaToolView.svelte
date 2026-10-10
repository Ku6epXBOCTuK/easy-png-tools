<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import Button from "$lib/components/ui/Button.svelte";
	import { ButtonVariantDefine } from "$lib/components/ui/define";
	import { isFav, toggleFav } from "$lib/favorites.svelte";
	import { GripVertical, Star } from "@lucide/svelte";
	import { DragDropProvider } from "@dnd-kit/svelte";
	import { hasTransparency } from "$lib/core/analyze";
	import { debounce } from "$lib/core/debounce";
	import { ToolError } from "$lib/core/errors";
	import { decodeFile, toDataUrl, type OutputMime } from "$lib/core/io";
	import { outputFormatByMime } from "$lib/output-formats";
	import type { PixelImage } from "$lib/core/types";
	import { baseName, uniqueName, type ChainWarning } from "$lib/run-chain";
	import {
		pageDescription,
		pageTitle,
		chainStepTitle,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import {
		autoChainName,
		createNamedChain,
		getChain,
		stashHandoff,
		takeHandoff,
		updateChainSteps,
	} from "$lib/chains.svelte";
	import {
		createChain,
		isStructuralDefault,
		moveStep,
		type ChainStep,
	} from "$lib/pipeline.svelte";
	import {
		getTool,
		type Page,
		type Tool,
		type ToolImageFile,
	} from "$lib/registry";
	import {
		applySourceDefaults,
		clampSourceAwareMaxes,
		sanitizeSchemaParams,
	} from "$lib/registry-schema";
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import { onMount } from "svelte";
	import { SvelteSet } from "svelte/reactivity";
	import AddStepButton from "./AddStepButton.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaFields from "./SchemaFields.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import SortableStepCard from "./SortableStepCard.svelte";
	import StepDropIndicator from "./StepDropIndicator.svelte";
	import ToolPickerButton from "./ToolPickerButton.svelte";
	import { hasPreviewResult } from "./schema-preview-model";
	import { createSchemaToolRunner } from "./schema-tool-runner.svelte";
	import { createStepDnd } from "./step-dnd.svelte";
	import {
		createSchemaToolState,
		toolSchemaOf,
	} from "./schema-tool-state.svelte";

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
	let source = $state<PixelImage | null>(null);
	// The full named input set (multi-upload); `source` above is the first
	// image for preview/defaults. Single upload = one element.
	let sourceFiles = $state<ToolImageFile[]>([]);
	let textSource = $state("");
	let sourceWarnings = $state<ChainWarning[]>([]);
	let initedFor = $state("");
	let format = $state<OutputMime>("image/png");
	// Lossy-format quality for tools without a quality param in the schema.
	let formatQuality = $state<Record<string, number>>({});
	// Optional download size limit (KB); undefined = no limit.
	let limitKb = $state<number | undefined>(undefined);
	// Mask preview per step (keyed by step.key): the toggle lives on every
	// step result tile, not just the final one.
	const maskOnKeys = new SvelteSet<string>();
	// Mask preview: recomputed on the main thread per toggled step from that
	// step's input; a mask never enters the chain itself.
	const maskResults = $derived.by(() => {
		const next: Record<string, PixelImage | null> = {};
		steps.forEach((step, i) => {
			if (!maskOnKeys.has(step.key)) return;
			const stepTool = getTool(step.id);
			if (!stepTool?.runMask) return;
			const input = i === 0 ? source : stepResults[i - 1];
			if (!input) return;
			// Same contract as executor.ts: params are sanitized against the
			// schema with the step input as the source context.
			const stepSchema = toolSchemaOf(step);
			const params = stepSchema
				? sanitizeSchemaParams(stepSchema, step.params, { source: input })
				: step.params;
			try {
				next[step.key] = stepTool.runMask({ params, source: input });
			} catch {
				next[step.key] = null;
			}
		});
		return next;
	});

	const stepState = createSchemaToolState({
		source: () => source,
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

	const runner = createSchemaToolRunner({
		pageSlug: () => page.slug,
		schema: () => schema,
		steps: () => steps,
		source: () => source,
		sourceFiles: () => sourceFiles,
		textSource: () => textSource,
		format: () => format,
		quality: () => currentQuality,
		limitKb: () => limitKb,
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
	const allWarnings = $derived([...sourceWarnings, ...runWarnings]);

	const lastTool = $derived(
		(steps.length > 0 ? getTool(steps[steps.length - 1].id) : undefined) ??
			tool,
	);
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

	const alphaLoss = $derived(
		resultKind === "image" &&
			result !== null &&
			!outputFormatByMime(format).supportsAlpha &&
			hasTransparency(result),
	);
	// If the last step's schema has a quality param (convert tools), it is the
	// single source of quality; the dropdown edits the same value.
	const qualityParamId = $derived(lastTool.output?.qualityParamId);
	const lastParams = $derived(steps.at(-1)?.params);
	const resultNote = $derived(
		result && lastTool.resultNote
			? lastTool.resultNote(lastParams ?? {}, result)
			: null,
	);
	const currentQuality = $derived.by(() => {
		const setting = outputFormatByMime(format).settings?.quality;
		if (!setting) return undefined;
		if (qualityParamId && lastParams) return Number(lastParams[qualityParamId]);
		return formatQuality[format] ?? setting.default;
	});

	function setFormatQuality(q: number) {
		if (qualityParamId) {
			setStepValue(steps.length - 1, qualityParamId, q);
		} else {
			formatQuality = { ...formatQuality, [format]: q };
		}
	}

	const errorText = $derived.by(() => {
		const current = displayError;
		if (!current) return "";
		return current.kind === "i18n"
			? t(current.key, current.vars)
			: current.text;
	});

	const stepMaskable = $derived(steps.map((s) => !!getTool(s.id)?.runMask));
	const stepMaskOn = $derived(steps.map((s) => maskOnKeys.has(s.key)));
	const stepMasks = $derived(steps.map((s) => maskResults[s.key] ?? null));

	const debouncedRun = debounce(() => run(), 200);

	function stepTitle(toolId: string): string {
		return chainStepTitle(toolId);
	}

	function init() {
		if (!schema) return;
		const host = chainId ? `chain:${chainId}` : page.slug;
		if (host === initedFor) return;
		initedFor = host;
		// Invalidate any in-flight run from the previous host.
		runner.resetForHost();
		if (chainId) {
			const handoff = takeHandoff(chainId);
			stepState.steps = getChain(chainId)?.steps ?? createChain(page);
			source = handoff?.source ?? null;
			sourceFiles =
				handoff?.sourceFiles ??
				(handoff?.source
					? [{ name: `${baseName(page.slug)}.png`, image: handoff.source }]
					: []);
			textSource = handoff?.textSource ?? "";
			if (handoff?.format) format = handoff.format;
			else format = lastTool.output?.mime ?? "image/png";
			limitKb = handoff?.limitKb;
		} else {
			stepState.steps = createChain(page);
			format = lastTool.output?.mime ?? "image/png";
			limitKb = undefined;
			source = null;
			sourceFiles = [];
			textSource = "";
		}
		sourceWarnings = [];
		maskOnKeys.clear();
		stepState.clearMarks();
	}

	async function handleFiles(files: File[]) {
		runner.displayError = null;
		sourceWarnings = [];
		const decoded: ToolImageFile[] = [];
		const usedNames = new SvelteSet<string>();
		let skipped = 0;
		for (const file of files) {
			try {
				const name = uniqueName(`${baseName(file.name)}.png`, usedNames);
				usedNames.add(name);
				decoded.push({ name, image: await decodeFile(file) });
			} catch {
				skipped++;
			}
		}
		if (decoded.length === 0) {
			runner.reportError(new ToolError("errors.imageDecode"));
			return;
		}
		if (skipped > 0) {
			sourceWarnings = [{ kind: "sourceSkip", skipped, total: files.length }];
		}
		const firstImage = decoded[0].image;
		source = firstImage;
		sourceFiles = decoded;
		const first = steps[0];
		const firstSchema = first ? toolSchemaOf(first) : undefined;
		if (first && firstSchema) {
			stepState.steps = steps.with(0, {
				...first,
				params: clampSourceAwareMaxes(
					firstSchema,
					applySourceDefaults(
						firstSchema,
						first.params,
						{ source: firstImage },
						stepState.touchedFor(first.key),
					),
					firstImage,
				),
			});
		}
	}

	async function handleFile(file: File) {
		await handleFiles([file]);
	}

	$effect(() => {
		init();
	});

	// Named-chain mode autosaves into the chains store; a plain tool page
	// persists nothing -- it becomes a named chain on structural change below.
	$effect(() => {
		if (!initedFor || !chainId) return;
		void steps;
		updateChainSteps(chainId, steps);
	});

	// A tool page turns into a pipeline on the first structural change (step
	// added, first tool swapped): create the named chain and swap routes
	// seamlessly -- steps persist via the store, the source via the handoff.
	$effect(() => {
		if (!initedFor || chainId) return;
		void steps;
		if (isStructuralDefault(page, steps)) return;
		const chain = createNamedChain(autoChainName(), steps);
		stashHandoff(chain.id, {
			source,
			sourceFiles,
			textSource,
			format,
			limitKb,
		});
		goto(resolve(`/pipeline?id=${chain.id}`), {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	});

	onMount(() => {
		if (inputMode !== "image") return;
		function onPaste(e: ClipboardEvent) {
			const target = e.target as HTMLElement | null;
			if (target?.closest("input, textarea, [contenteditable]")) return;
			for (const item of e.clipboardData?.items ?? []) {
				if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
				const file = item.getAsFile();
				if (file) {
					e.preventDefault();
					void handleFile(file);
				}
				return;
			}
		}
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
	});

	$effect(() => {
		if (!initedFor) return;
		if (inputMode === "image" && !source) return;
		if (inputMode === "text" && !textSource.trim()) return;
		void steps;
		void source;
		debouncedRun();
		return () => debouncedRun.cancel();
	});

	function toggleStepMask(key: string) {
		if (maskOnKeys.has(key)) maskOnKeys.delete(key);
		else maskOnKeys.add(key);
	}

	function toggleStepMaskByIndex(i: number) {
		const step = steps[i];
		if (step) toggleStepMask(step.key);
	}

	function warningText(w: ChainWarning): string {
		switch (w.kind) {
			case "partial":
				return t("chain.warnPartial", { n: w.step, ok: w.ok, total: w.total });
			case "firstOnly":
				return t("chain.warnFirstOnly", { n: w.step, total: w.total });
			case "sourceSkip":
				return t("chain.warnSourceSkip", {
					skipped: w.skipped,
					total: w.total,
				});
		}
	}

	// Explicit save for a structurally default chain (single tuned step): the
	// auto-create effect only fires on structural change.
	function saveAsChain() {
		const chain = createNamedChain(autoChainName(), steps);
		stashHandoff(chain.id, {
			source,
			sourceFiles,
			textSource,
			format,
			limitKb,
		});
		goto(resolve(`/pipeline?id=${chain.id}`), {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
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
					onclick={saveAsChain}
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
						sourceDims={i === 0 ? (source ?? undefined) : stepDims[i - 1]}
						onchange={(id, v, axis) => setStepValue(i, id, v, axis)}
						onreset={() => resetStep(i)}
					/>
				{/if}
			</SortableStepCard>
		{/snippet}

		{#snippet maskChip(i: number)}
			{#if stepMaskable[i]}
				<ChipButton
					label={t("resultCard.maskToggle")}
					active={stepMaskOn[i] ?? false}
					onclick={() => toggleStepMaskByIndex(i)}
				/>
			{/if}
		{/snippet}

		{#snippet inputTile(i: number)}
			{#if i === 0}
				<SchemaSourceTile
					mode={inputMode}
					{source}
					sources={sourceFiles}
					{textSource}
					running={busy}
					fileCount={sourceFiles.length}
					ontextinput={(v) => (textSource = v)}
					onrendertext={run}
					onupload={handleFile}
					onuploadmany={handleFiles}
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
					mask={stepMasks[i] ?? null}
					maskOn={stepMaskOn[i] ?? false}
					ontogglemask={stepMaskable[i]
						? () => toggleStepMaskByIndex(i)
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
					{#if outSet.length > 1 && !stepMaskOn[i]}
						<PartsGrid files={outSet} />
					{:else if out}
						<img
							src={toDataUrl(
								stepMaskOn[i] && stepMasks[i]
									? (stepMasks[i] as PixelImage)
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
					{format}
					quality={currentQuality}
					{limitKb}
					{alphaLoss}
					onupload={handleFile}
					ondownload={download}
					onformat={(v) => (format = v)}
					onquality={setFormatQuality}
					onlimit={(v) => (limitKb = v)}
				/>
			</div>
		{/snippet}

		{#snippet addRow(index: number)}
			{#if canExtend && !stepDnd.active}
				<div class="add-row">
					<AddStepButton onadd={(id) => addStepAt(index, id)} />
					{#if alignedMode}
						<div class="row-bridge" aria-hidden="true"></div>
					{/if}
				</div>
			{/if}
		{/snippet}

		{#snippet indicator(slot: number)}
			{#if stepDnd.isIndicatorAt(slot)}
				<div class="indicator-row">
					<StepDropIndicator height={stepDnd.dragHeight} />
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
				<div class="workspace aligned" class:dnd-active={stepDnd.active}>
					<div class="head-spacer" aria-hidden="true"></div>
					{@render panelHead()}
					{@render addRow(0)}
					{#each steps as step, i (step.key)}
						{@render indicator(i)}
						{@render stepCard(step, i)}
						<div class="pair">
							{@render inputTile(i)}
							{@render outputTile(i)}
						</div>
						{@render addRow(i + 1)}
					{/each}
					{@render indicator(steps.length)}
					<div class="panel-foot" aria-hidden="true"></div>
				</div>
			{:else}
				<div class="workspace" class:dnd-active={stepDnd.active}>
					<section class="settings">
						{@render addRow(0)}
						{#each steps as step, i (step.key)}
							{@render indicator(i)}
							{@render stepCard(step, i)}
							{@render addRow(i + 1)}
						{/each}
						{@render indicator(steps.length)}
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
			{#each allWarnings as w (warningText(w))}
				<p class="warn" role="status">{warningText(w)}</p>
			{/each}
			{#if stepDnd.activeData && stepDnd.pointer}
				<div
					class="step-ghost"
					style:width="{stepDnd.ghostWidth}px"
					style:left="{stepDnd.pointer.x - stepDnd.grabOffset.x}px"
					style:top="{stepDnd.pointer.y - stepDnd.grabOffset.y}px"
				>
					<GripVertical size={16} aria-hidden="true" />
					<span class="step-ghost-title">{stepDnd.activeData.title}</span>
				</div>
			{/if}
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
	.step-ghost {
		position: fixed;
		z-index: var(--z-drag);
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-xl);
		border: var(--size-border-thick) dashed var(--color-main);
		background: var(--color-panel);
		color: var(--color-border);
		opacity: 0.85;
		pointer-events: none;
	}
	.step-ghost-title {
		font: 600 var(--font-size-m) var(--font-mono);
		color: var(--color-text);
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
	.aligned .add-row,
	.aligned .indicator-row {
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
	/* Compact drag: while a step is dragged, cards collapse to headers so the
	   reorder happens in a tight list; aligned additionally drops the preview
	   panel (its rows are too tall to drag across). */
	.dnd-active :global(.step-body) {
		display: none;
	}
	.aligned.dnd-active .panel-head,
	.aligned.dnd-active .pair,
	.aligned.dnd-active .row-bridge,
	.aligned.dnd-active .panel-foot,
	.aligned.dnd-active .head-spacer {
		display: none;
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
