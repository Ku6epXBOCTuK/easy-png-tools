<script lang="ts">
	import SchemaFields from "./SchemaFields.svelte";
	import SchemaPreview from "./SchemaPreview.svelte";
	import { debounce } from "$lib/core/debounce";
	import { ToolError, type ErrorVars } from "$lib/core/errors";
	import { decodeFile, downloadBlob, encode } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { execute } from "$lib/executor";
	import {
		pageDescription,
		pageTitle,
		verdictText,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import type { FileResult, Page, Tool } from "$lib/registry";
	import {
		applySourceDefaults,
		defaultSchemaParams,
		sanitizeSchemaParams,
		withAspectLock,
		type Dimension,
		type ToolSchema,
	} from "$lib/registry-schema";
	import { downloadZip } from "$lib/zip";
	import { SvelteSet } from "svelte/reactivity";

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
	const resultKind = $derived(tool.result ?? "image");

	let values = $state<Record<string, unknown>>({});
	// Поля, изменённые пользователем: при загрузке нового файла им не даём
	// перезаписаться source-дефолтами. Reset снимает пометку.
	const touched = new SvelteSet<string>();
	// Последняя правленая ось dimension-поля — ведущая при lockAspect.
	const lastAxis: Record<string, "width" | "height"> = {};
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
	let started = $state(false);

	const errorText = $derived.by(() => {
		const current = displayError;
		if (!current) return "";
		return current.kind === "i18n"
			? t(current.key, current.vars)
			: current.text;
	});

	const debouncedRun = debounce(() => run(), 200);

	function init() {
		if (!schema || started) return;
		started = true;
		values = defaultSchemaParams(schema);
	}

	function setValue(id: string, value: unknown, axis?: "width" | "height") {
		touched.add(id);
		if (axis) lastAxis[id] = axis;
		const next: Record<string, unknown> = { ...values, [id]: value };
		const spec = schema?.fields[id]?.spec;
		if (source && schema && spec) {
			const aspect = source.width / source.height;
			if (
				spec.kind === "dimension" &&
				spec.lockAspectWith &&
				next[spec.lockAspectWith] === true
			) {
				next[id] = withAspectLock(
					value as Dimension,
					lastAxis[id] ?? "width",
					aspect,
				);
			} else if (spec.kind === "checkbox" && value === true) {
				// Включили lockAspect — сразу подгоняем привязанные поля под аспект.
				for (const [fid, f] of Object.entries(schema.fields)) {
					const fs = f.spec;
					if (fs.kind === "dimension" && fs.lockAspectWith === id) {
						next[fid] = withAspectLock(
							next[fid] as Dimension,
							lastAxis[fid] ?? "width",
							aspect,
						);
					}
				}
			}
		}
		values = next;
	}

	function reset() {
		touched.clear();
		values = schema
			? defaultSchemaParams(schema, { source: source ?? undefined })
			: {};
		result = null;
		fileResult = null;
		textResult = null;
		verdictVars = undefined;
		displayError = null;
	}

	async function handleFile(file: File) {
		displayError = null;
		try {
			const decoded = await decodeFile(file);
			source = decoded;
			if (schema) {
				values = applySourceDefaults(
					schema,
					values,
					{ source: decoded },
					touched,
				);
			}
		} catch (e) {
			displayError = toDisplayError(e);
		}
	}

	async function run() {
		if (!schema) return;
		displayError = null;
		running = true;
		try {
			const out = await execute(tool, {
				params: sanitizeSchemaParams(schema, values, {
					source: source ?? undefined,
				}),
				source: source ?? undefined,
				text: textSource || undefined,
			});
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
			const out = tool.output;
			const quality = out?.qualityParamId
				? Number(values[out.qualityParamId]) / 100
				: undefined;
			const blob = await encode(result, out?.mime ?? "image/png", quality);
			downloadBlob(blob, `${page.slug}.${out?.ext ?? "png"}`);
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
				? verdictText(tool.id, textResult, verdictVars)
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

	$effect(() => {
		if (!started) return;
		if (inputMode === "image" && !source) return;
		if (inputMode === "text" && !textSource.trim()) return;
		void values;
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

		<div class="workspace">
			<section class="panel settings">
				<div class="panel-head">
					<span class="label">{t("paramsCard.toolSettings")}</span>
					<strong>{t("paramsCard.configureOutput")}</strong>
				</div>
				<SchemaFields
					{schema}
					{values}
					toolId={tool.id}
					onchange={setValue}
					onreset={reset}
				/>
			</section>

			<section class="panel">
				<SchemaPreview
					toolId={tool.id}
					{source}
					{result}
					{fileResult}
					{textSource}
					{textResult}
					textVars={verdictVars}
					{inputMode}
					{resultKind}
					{running}
					error={errorText}
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
	.label {
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	.label {
		color: var(--color-main);
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
	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-m);
		padding-bottom: var(--space-l);
		border-bottom: var(--size-border) solid var(--color-border);
		margin-bottom: var(--space-xl);
	}
	.panel-head strong {
		font-size: var(--font-size-l);
		color: var(--color-text);
	}
	.no-schema {
		font: var(--font-size-s) var(--font-mono);
	}
	@media (--bp-tablet) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
