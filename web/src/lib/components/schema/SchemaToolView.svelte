<script lang="ts">
	import StepCard from "$lib/components/display/StepCard.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import { hasTransparency } from "$lib/core/analyze";
	import { debounce } from "$lib/core/debounce";
	import { ToolError, type ErrorVars } from "$lib/core/errors";
	import {
		decodeFile,
		downloadBlob,
		encode,
		outputFormatByMime,
		toDataUrl,
		type OutputMime,
	} from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { execute } from "$lib/executor";
	import {
		pageDescription,
		pageTitle,
		verdictText,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import {
		createChain,
		createStep,
		insertStep,
		loadChain,
		moveStep,
		removeStep,
		saveChain,
		type ChainStep,
	} from "$lib/pipeline.svelte";
	import {
		getTool,
		PAGES,
		type FileResult,
		type Page,
		type Tool,
		type ToolResult,
	} from "$lib/registry";
	import {
		applySourceDefaults,
		clampSourceAwareMaxes,
		defaultSchemaParams,
		withAspectLock,
		type Dimension,
		type ToolSchema,
	} from "$lib/registry-schema";
	import { downloadZip } from "$lib/zip";
	import { onMount } from "svelte";
	import { SvelteMap, SvelteSet } from "svelte/reactivity";
	import AddStepButton from "./AddStepButton.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaFields from "./SchemaFields.svelte";
	import SchemaPreview from "./SchemaPreview.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";
	import ToolPickerButton from "./ToolPickerButton.svelte";

	interface Props {
		page: Page;
		tool: Tool;
	}
	type DisplayError =
		| { kind: "i18n"; key: string; vars?: ErrorVars }
		| { kind: "plain"; text: string };
	let { page, tool }: Props = $props();

	const schema = $derived(
		tool.schema as ToolSchema<Record<string, unknown>> | undefined,
	);

	const inputMode = $derived(tool.input);

	let steps = $state<ChainStep[]>([]);
	// Поля, изменённые пользователем (по шагам): при загрузке нового файла им не
	// даём перезаписаться source-дефолтами. Reset шага снимает пометку.
	const touchedByStep = new SvelteMap<string, SvelteSet<string>>();
	// Последняя правленая ось dimension-поля — ведущая при lockAspect.
	const lastAxis: Record<string, "width" | "height"> = {};
	let stepDims = $state<(Dimension | undefined)[]>([]);
	let stepResults = $state<(PixelImage | null)[]>([]);
	let aligned = $state(false);
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let fileResult = $state<FileResult | null>(null);
	let textSource = $state("");
	let textResult = $state<string | null>(null);
	let verdictVars = $state<Record<string, string | number> | undefined>(
		undefined,
	);
	let running = $state(false);
	let displayError = $state<DisplayError | null>(null);
	let initedFor = $state("");
	let format = $state<OutputMime>("image/png");
	// Качество lossy-форматов для инструментов без quality-параметра в схеме.
	let formatQuality = $state<Record<string, number>>({});
	let dragFrom = $state<number | null>(null);

	const lastTool = $derived(
		(steps.length > 0 ? getTool(steps[steps.length - 1].id) : undefined) ??
			tool,
	);
	const resultKind = $derived(lastTool.result ?? "image");
	// Цепочку можно продолжить, только если последний шаг отдаёт картинку.
	const canExtend = $derived((lastTool.result ?? "image") === "image");
	const alignedMode = $derived(
		aligned && resultKind === "image" && steps.length > 1,
	);

	const alphaLoss = $derived(
		resultKind === "image" &&
			result !== null &&
			!outputFormatByMime(format).supportsAlpha &&
			hasTransparency(result),
	);
	// Если в схеме последнего шага есть quality-параметр (convert-инструменты),
	// он — единый источник качества; dropdown редактирует его же.
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
		const owner = PAGES.find((p) => p.steps[0].id === toolId);
		return owner ? pageTitle(owner) : toolId;
	}

	function init() {
		if (!schema || page.slug === initedFor) return;
		initedFor = page.slug;
		steps = loadChain(page.slug) ?? createChain(page);
		format = lastTool.output?.mime ?? "image/png";
		source = null;
		result = null;
		fileResult = null;
		textResult = null;
		verdictVars = undefined;
		displayError = null;
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
		// Аспект считается от входа шага: для первого — исходник, для остальных —
		// результат предыдущего шага (размеры известны после прогона).
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
				// Включили lockAspect — сразу подгоняем привязанные поля под аспект.
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
		result = null;
		fileResult = null;
		textResult = null;
		verdictVars = undefined;
		displayError = null;
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

	// Замена инструмента на месте: ключ и свёрнутость шага сохраняются,
	// параметры — дефолты нового инструмента, вход пересчитывается при прогоне.
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

	async function handleFile(file: File) {
		displayError = null;
		try {
			const decoded = await decodeFile(file);
			source = decoded;
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
							{ source: decoded },
							touchedFor(first.key),
						),
						decoded,
					),
				});
			}
		} catch (e) {
			displayError = toDisplayError(e);
		}
	}

	function assignResult(out: ToolResult) {
		if (resultKind === "image") {
			result = out as PixelImage;
			textResult = null;
			fileResult = null;
		} else if (resultKind === "files") {
			fileResult = out as FileResult;
			result = null;
			textResult = null;
		} else {
			if (typeof out === "string") {
				textResult = out;
				verdictVars = undefined;
			} else if (out && "key" in out) {
				textResult = out.key;
				verdictVars = out.vars;
			} else {
				textResult = null;
				verdictVars = undefined;
			}
			result = null;
			fileResult = null;
		}
	}

	async function run() {
		if (!schema || steps.length === 0) return;
		displayError = null;
		running = true;
		try {
			let current: PixelImage | undefined = source ?? undefined;
			const dims: (Dimension | undefined)[] = [];
			const results: (PixelImage | null)[] = [];
			let out: ToolResult = "";
			for (let i = 0; i < steps.length; i++) {
				const stepTool = getTool(steps[i].id);
				if (!stepTool) continue;
				try {
					out = await execute(stepTool, {
						params: steps[i].params,
						source: stepTool.input === "image" ? current : undefined,
						text:
							stepTool.input === "text" ? textSource || undefined : undefined,
					});
				} catch (e) {
					const base = toDisplayError(e);
					const msg = base.kind === "i18n" ? t(base.key, base.vars) : base.text;
					throw new Error(
						t("toolPage.stepError", {
							n: i + 1,
							title: stepTitle(stepTool.id),
							msg,
						}),
						{ cause: e },
					);
				}
				if (out && typeof out === "object" && "data" in out) {
					current = out as PixelImage;
					dims[i] = { width: current.width, height: current.height };
					results[i] = current;
				} else {
					current = undefined;
					results[i] = null;
				}
			}
			stepDims = dims;
			stepResults = results;
			assignResult(out);
		} catch (e) {
			displayError = toDisplayError(e);
		} finally {
			running = false;
		}
	}

	async function download() {
		if (!schema) return;
		running = true;
		displayError = null;
		try {
			if (resultKind === "files") {
				if (!fileResult) return;
				await downloadZip(fileResult.files, `${page.slug}.zip`);
				return;
			}
			if (!result) return;
			const out = outputFormatByMime(format);
			const quality =
				currentQuality !== undefined ? currentQuality / 100 : undefined;
			const blob = await encode(result, out.mime, quality);
			downloadBlob(blob, `${page.slug}.${out.ext}`);
		} catch (e) {
			displayError = toDisplayError(e);
		} finally {
			running = false;
		}
	}

	async function copyText() {
		if (!textResult) return;
		const copyValue =
			resultKind === "verdict"
				? verdictText(lastTool.id, textResult, verdictVars)
				: textResult;
		try {
			await navigator.clipboard.writeText(copyValue);
		} catch (e) {
			displayError = toDisplayError(e);
		}
	}

	async function downloadText() {
		if (!textResult) return;
		try {
			const blob = new Blob([textResult], { type: "text/plain" });
			downloadBlob(blob, `${page.slug}.txt`);
		} catch (e) {
			displayError = toDisplayError(e);
		}
	}

	$effect(() => {
		init();
	});

	// Цепочка персистится по slug страницы; сохраняем после инициализации.
	$effect(() => {
		if (!initedFor) return;
		void steps;
		saveChain(initedFor, steps);
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

	function toDisplayError(e: unknown): DisplayError {
		if (e instanceof ToolError) {
			return { kind: "i18n", key: e.key, vars: e.vars };
		}
		if (e instanceof Error) return { kind: "plain", text: e.message };
		return { kind: "plain", text: String(e) };
	}
</script>

{#if schema}
	<div class="schema-tool">
		<header class="header">
			<div class="title-block">
				<h1>{pageTitle(page)}</h1>
				<p class="lede">{pageDescription(page)}</p>
			</div>
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
						{result}
						{resultNote}
						{fileResult}
						{textSource}
						{textResult}
						textVars={verdictVars}
						{inputMode}
						{resultKind}
						{running}
						error={errorText}
						{format}
						quality={currentQuality}
						{alphaLoss}
						{stepResults}
						{aligned}
						ontogglealign={() => (aligned = !aligned)}
						onformat={(v) => (format = v)}
						onquality={setFormatQuality}
						onupload={handleFile}
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
		{:else}
			<div class="aligned">
				<div class="aligned-row">
					<div></div>
					<div class="panel-segment head-segment">
						<span class="label">{t("resultCard.previewPanel")}</span>
						<label class="align-toggle">
							<Toggle bind:checked={aligned} label={t("chain.alignToggle")} />
							<span>{t("chain.alignToggle")}</span>
						</label>
						<SchemaActions
							{inputMode}
							{resultKind}
							canDownload={result !== null}
							{running}
							{format}
							quality={currentQuality}
							{alphaLoss}
							onupload={handleFile}
							ondownload={download}
							onformat={(v) => (format = v)}
							onquality={setFormatQuality}
						/>
					</div>
				</div>
				{#if errorText}
					<p class="error" role="alert">{errorText}</p>
				{/if}
				{#if canExtend}
					<div class="aligned-row">
						<AddStepButton onadd={(id) => addStepAt(0, id)} />
						<div class="panel-segment connect-segment"></div>
					</div>
				{/if}
				{#each steps as step, i (step.key)}
					{@const input = i === 0 ? null : stepResults[i - 1]}
					{@const out = stepResults[i]}
					{#if i > 0}
						<div class="group-divider">
							<div class="gd-cell"></div>
						</div>
					{/if}
					<div class="aligned-row">
						{@render stepCard(step, i)}
						<div
							class="panel-segment pair-segment"
							class:last-segment={i === steps.length - 1 && !canExtend}
						>
							{#if i === 0}
								<SchemaSourceTile
									mode={inputMode}
									{source}
									{textSource}
									{running}
									ontextinput={(v) => (textSource = v)}
									onrendertext={run}
									onupload={handleFile}
								/>
							{:else}
								<PreviewTile
									label={t("chain.inputLegend")}
									viewMode="image"
									dims={input ? `${input.width} × ${input.height}` : undefined}
								>
									{#if input}
										<img src={toDataUrl(input)} alt="" />
									{:else}
										<span class="empty">{t("resultCard.noResult")}</span>
									{/if}
								</PreviewTile>
							{/if}
							{#if i === steps.length - 1}
								<SchemaResultTile
									{resultKind}
									result={out}
									{resultNote}
									{fileResult}
									{textResult}
									textVars={verdictVars}
									toolId={lastTool.id}
									{running}
									oncopy={copyText}
									ondownloadtxt={downloadText}
								/>
							{:else}
								<PreviewTile
									label={t("chain.stepResult", { n: i + 1 })}
									viewMode="image"
									dims={out ? `${out.width} × ${out.height}` : undefined}
								>
									{#if out}
										<img src={toDataUrl(out)} alt="" />
									{:else}
										<span class="empty">{t("resultCard.noResult")}</span>
									{/if}
								</PreviewTile>
							{/if}
						</div>
					</div>
					{#if canExtend}
						<div class="aligned-row">
							<AddStepButton onadd={(id) => addStepAt(i + 1, id)} />
							<div
								class="panel-segment connect-segment"
								class:add-last={i === steps.length - 1}
							></div>
						</div>
					{/if}
				{/each}
			</div>
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
		margin: var(--space-s) 0 0;
		font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-2xl));
		line-height: 1.1;
		color: var(--color-text);
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
	.aligned {
		display: grid;
	}
	.aligned-row {
		display: grid;
		grid-template-columns: minmax(var(--size-workspace-min), 1fr) 2fr;
		gap: var(--space-xxl);
		align-items: start;
	}
	/* Сегменты справа образуют «одну панель»: общий фон, боковые границы,
	   верх у шапки и низ у последней строки. */
	.panel-segment {
		background: var(--color-panel);
		border-left: var(--size-border) solid var(--color-border);
		border-right: var(--size-border) solid var(--color-border);
		padding: var(--space-xl);
	}
	.head-segment {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
		flex-wrap: wrap;
		border-top: var(--size-border) solid var(--color-border);
		border-bottom: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m) var(--radius-m) 0 0;
	}
	.head-segment .label {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
		color: var(--color-main);
	}
	.pair-segment {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-l);
	}
	/* Коннектор в строках «Add step»: продолжает боковые границы панели. */
	.connect-segment {
		align-self: stretch;
		padding: 0;
	}
	.connect-segment.add-last {
		border-bottom: var(--size-border) solid var(--color-border);
		border-radius: 0 0 var(--radius-m) var(--radius-m);
	}
	/* Полоса-разделитель между группами: ячейки с фоном и боковыми границами
	   (как у карточки слева и панели справа), сверху — линия через всю ширину. */
	.group-divider {
		position: relative;
		display: grid;
		grid-template-columns: minmax(var(--size-workspace-min), 1fr) 2fr;
		gap: var(--space-xxl);
	}
	.gd-cell {
		grid-column: 2;
		background: var(--color-panel);
		border-left: var(--size-border) solid var(--color-border);
		border-right: var(--size-border) solid var(--color-border);
		padding: var(--space-s) 0;
	}
	.group-divider::after {
		content: "";
		position: absolute;
		inset: 0 0 auto;
		border-top: var(--size-border) solid var(--color-border);
	}
	.last-segment {
		border-bottom: var(--size-border) solid var(--color-border);
		border-radius: 0 0 var(--radius-m) var(--radius-m);
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
	.error {
		margin: 0;
		color: var(--color-danger);
		font: var(--font-size-s) var(--font-mono);
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	@media (--bp-tablet) {
		.workspace {
			grid-template-columns: 1fr;
		}
		.aligned-row {
			grid-template-columns: 1fr;
		}
	}
</style>
