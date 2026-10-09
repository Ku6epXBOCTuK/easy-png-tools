<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import StepCard from "$lib/components/display/StepCard.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { ButtonVariantDefine } from "$lib/components/ui/define";
	import { isFav, toggleFav } from "$lib/favorites.svelte";
	import { Star } from "@lucide/svelte";
	import { hasTransparency } from "$lib/core/analyze";
	import { debounce } from "$lib/core/debounce";
	import { ToolError } from "$lib/core/errors";
	import {
		decodeFile,
		outputFormatByMime,
		type OutputMime,
	} from "$lib/core/io";
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
		createStep,
		insertStep,
		isStructuralDefault,
		moveStep,
		removeStep,
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
		defaultSchemaParams,
		withAspectLock,
		type Dimension,
		type ToolSchema,
	} from "$lib/registry-schema";
	import { onMount } from "svelte";
	import { SvelteMap, SvelteSet } from "svelte/reactivity";
	import AddStepButton from "./AddStepButton.svelte";
	import SchemaAlignedLayout from "./SchemaAlignedLayout.svelte";
	import SchemaFields from "./SchemaFields.svelte";
	import SchemaPreview from "./SchemaPreview.svelte";
	import ToolPickerButton from "./ToolPickerButton.svelte";
	import { createSchemaToolRunner } from "./schema-tool-runner.svelte";

	interface Props {
		page: Page;
		tool: Tool;
		/** Named-chain mode: the chain id and display name; page is virtual. */
		chainId?: string;
	}
	let { page, tool, chainId = undefined }: Props = $props();

	const schema = $derived(
		tool.schema as ToolSchema<Record<string, unknown>> | undefined,
	);

	const inputMode = $derived(tool.input);

	let steps = $state<ChainStep[]>([]);
	// Fields edited by the user (per step): on new file load they must not be
	// overwritten by source defaults. Step reset clears the mark.
	const touchedByStep = new SvelteMap<string, SvelteSet<string>>();
	// Last edited axis of a dimension field; leads under lockAspect.
	const lastAxis: Record<string, "width" | "height"> = {};
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
			try {
				next[step.key] = stepTool.runMask({
					params: step.params,
					source: input,
				});
			} catch {
				next[step.key] = null;
			}
		});
		return next;
	});
	let dragFrom = $state<number | null>(null);

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

	function touchedFor(key: string): SvelteSet<string> {
		let set = touchedByStep.get(key);
		if (!set) {
			set = new SvelteSet();
			touchedByStep.set(key, set);
		}
		return set;
	}

	function toolSchemaOf(step: ChainStep) {
		return getTool(step.id)?.schema as ToolSchema<Record<string, unknown>>;
	}

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
			steps = getChain(chainId)?.steps ?? createChain(page);
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
			steps = createChain(page);
			format = lastTool.output?.mime ?? "image/png";
			limitKb = undefined;
			source = null;
			sourceFiles = [];
			textSource = "";
		}
		sourceWarnings = [];
		maskOnKeys.clear();
		// Marks are keyed by step.key from the previous host; keep them and
		// stale keys leak into the new chain's fields.
		touchedByStep.clear();
		for (const k of Object.keys(lastAxis)) delete lastAxis[k];
	}

	function setStepValue(
		index: number,
		id: string,
		value: unknown,
		axis?: "width" | "height" | "both",
	) {
		const step = steps[index];
		if (!step) return;
		touchedFor(step.key).add(id);
		const axisKey = `${step.key}:${id}`;
		if (axis) lastAxis[axisKey] = axis === "both" ? "width" : axis;
		const next: Record<string, unknown> = { ...step.params, [id]: value };
		const stepSchema = toolSchemaOf(step);
		const spec = stepSchema?.fields[id]?.spec;
		// Aspect derives from the step input: source for the first step,
		// previous step's result for the rest (dims known after the run).
		const dims = index === 0 ? (source ?? undefined) : stepDims[index - 1];
		if (dims && stepSchema && spec) {
			const aspect = dims.width / dims.height;
			if (
				spec.kind === "dimension" &&
				spec.lockAspectWith &&
				axis !== "both" &&
				next[spec.lockAspectWith] === true
			) {
				next[id] = withAspectLock(
					value as Dimension,
					lastAxis[axisKey] ?? "width",
					aspect,
				);
			} else if (spec.kind === "checkbox" && value === true) {
				// lockAspect just enabled: snap bound fields to the aspect at once.
				for (const [fid, f] of Object.entries(stepSchema.fields)) {
					const fs = f.spec;
					if (fs.kind === "dimension" && fs.lockAspectWith === id) {
						next[fid] = withAspectLock(
							next[fid] as Dimension,
							lastAxis[`${step.key}:${fid}`] ?? "width",
							aspect,
						);
					}
				}
			}
		}
		const clamped = dims ? clampSourceAwareMaxes(stepSchema, next, dims) : next;
		steps = steps.with(index, { ...step, params: clamped });
	}

	function resetStep(index: number) {
		const step = steps[index];
		if (!step) return;
		touchedFor(step.key).clear();
		const stepSchema = toolSchemaOf(step);
		const dims = index === 0 ? (source ?? undefined) : stepDims[index - 1];
		const params = stepSchema
			? defaultSchemaParams(stepSchema, { source: dims })
			: {};
		steps = steps.with(index, { ...step, params });
		runner.clearResults();
	}

	function addStepAt(index: number, toolId: string) {
		steps = insertStep(steps, index, toolId);
	}

	function removeStepAt(key: string) {
		steps = removeStep(steps, key);
	}

	function toggleStep(index: number) {
		const step = steps[index];
		if (!step) return;
		steps = steps.with(index, { ...step, collapsed: !step.collapsed });
	}

	// In-place tool swap: step key and collapsed state are kept, params become
	// the new tool's defaults, input is recomputed on run.
	function replaceStepTool(index: number, toolId: string) {
		const step = steps[index];
		const next = createStep(toolId);
		if (!step || !next) return;
		touchedFor(step.key).clear();
		steps = steps.with(index, {
			...next,
			key: step.key,
			collapsed: step.collapsed,
		});
	}

	function onStepDrop(e: DragEvent, to: number) {
		e.preventDefault();
		if (dragFrom !== null) steps = moveStep(steps, dragFrom, to);
		dragFrom = null;
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
			steps = steps.with(0, {
				...first,
				params: clampSourceAwareMaxes(
					firstSchema,
					applySourceDefaults(
						firstSchema,
						first.params,
						{ source: firstImage },
						touchedFor(first.key),
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
			<StepCard
				index={i + 1}
				title={stepTitle(step.id)}
				draggable
				collapsed={step.collapsed ?? false}
				ontoggle={() => toggleStep(i)}
				onremove={steps.length > 1 ? () => removeStepAt(step.key) : undefined}
				ondragstart={(e) => {
					dragFrom = i;
					if (e.dataTransfer) {
						e.dataTransfer.effectAllowed = "move";
						e.dataTransfer.setData("text/plain", String(i));
					}
				}}
				ondragover={(e) => {
					e.preventDefault();
					if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
				}}
				ondrop={(e) => onStepDrop(e, i)}
				ondragend={() => (dragFrom = null)}
			>
				{#snippet tools()}
					<ToolPickerButton
						label={t("chain.changeTool")}
						iconOnly
						onadd={(id) => replaceStepTool(i, id)}
					/>
				{/snippet}
				<SchemaFields
					schema={toolSchemaOf(step)}
					values={step.params}
					toolId={step.id}
					sourceDims={i === 0 ? (source ?? undefined) : stepDims[i - 1]}
					onchange={(id, v, axis) => setStepValue(i, id, v, axis)}
					onreset={() => resetStep(i)}
				/>
			</StepCard>
		{/snippet}

		{#if !alignedMode}
			<div class="workspace">
				<section class="settings">
					{#if canExtend}
						<AddStepButton onadd={(id) => addStepAt(0, id)} />
					{/if}
					{#each steps as step, i (step.key)}
						{@render stepCard(step, i)}
						{#if canExtend}
							<AddStepButton onadd={(id) => addStepAt(i + 1, id)} />
						{/if}
					{/each}
				</section>

				<section class="panel">
					<SchemaPreview
						toolId={lastTool.id}
						{source}
						sources={sourceFiles}
						fileCount={sourceFiles.length}
						{result}
						{resultNote}
						{fileResult}
						{textSource}
						{textResult}
						textVars={verdictVars}
						{inputMode}
						resultKind={displayResultKind}
						{running}
						error={errorText}
						{format}
						quality={currentQuality}
						{limitKb}
						{alphaLoss}
						{stepResults}
						{stepFileSets}
						{aligned}
						{stepMaskable}
						{stepMaskOn}
						{stepMasks}
						ontogglestepmask={toggleStepMaskByIndex}
						mask={stepMasks.at(-1) ?? null}
						maskOn={stepMaskOn.at(-1) ?? false}
						ontogglemask={stepMaskable.at(-1)
							? () => toggleStepMask(steps[steps.length - 1].key)
							: undefined}
						ontogglealign={() => (aligned = !aligned)}
						onformat={(v) => (format = v)}
						onquality={setFormatQuality}
						onlimit={(v) => (limitKb = v)}
						onupload={handleFile}
						onuploadmany={handleFiles}
						ontextsource={(textValue) => {
							textSource = textValue;
						}}
						onrendertext={run}
						oncopytext={copyText}
						ondownloadtxt={downloadText}
						ondownload={download}
					/>
				</section>
			</div>
			{#each allWarnings as w (warningText(w))}
				<p class="warn" role="status">{warningText(w)}</p>
			{/each}
		{:else}
			<SchemaAlignedLayout
				{steps}
				{stepCard}
				{canExtend}
				bind:aligned
				{inputMode}
				{source}
				{sourceFiles}
				{textSource}
				{running}
				resultKind={displayResultKind}
				{result}
				{resultNote}
				{fileResult}
				{textResult}
				textVars={verdictVars}
				toolId={lastTool.id}
				{format}
				quality={currentQuality}
				{limitKb}
				{alphaLoss}
				{errorText}
				warnings={allWarnings.map(warningText)}
				{stepResults}
				{stepFileSets}
				{stepMasks}
				{stepMaskOn}
				{stepMaskable}
				onaddstep={addStepAt}
				ontogglestepmask={toggleStepMaskByIndex}
				ontextinput={(v) => (textSource = v)}
				onrendertext={run}
				onupload={handleFile}
				onuploadmany={handleFiles}
				ondownload={download}
				oncopy={copyText}
				ondownloadtxt={downloadText}
				onformat={(v) => (format = v)}
				onquality={setFormatQuality}
				onlimit={(v) => (limitKb = v)}
			/>
		{/if}
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
	.workspace {
		display: grid;
		grid-template-columns: minmax(var(--size-workspace-min), 1fr) minmax(
				0,
				2fr
			);
		gap: var(--space-xxl);
		align-items: start;
	}
	.panel {
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
		padding: var(--space-xl);
	}
	.no-schema {
		font: var(--font-size-s) var(--font-mono);
	}
	.warn {
		margin: 0;
		color: var(--color-warning);
		font: var(--font-size-s) var(--font-mono);
	}
	@media (--bp-tablet) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
