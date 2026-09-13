<script lang="ts">
	import SchemaFields from "$lib/components/SchemaFields.svelte";
	import SchemaPreview from "$lib/components/SchemaPreview.svelte";
	import { debounce } from "$lib/core/debounce";
	import { ToolError } from "$lib/core/errors";
	import { decodeFile, encode } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { execute } from "$lib/executor";
	import {
		toolDescription,
		toolTitle,
		verdictText,
	} from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import type { FileResult, ToolEntry } from "$lib/registry";
	import {
		defaultSchemaParams,
		sanitizeSchemaParams,
		type ToolSchema,
	} from "$lib/registry-schema";
	import { downloadZip } from "$lib/zip";

	interface Props {
		tool: ToolEntry;
	}
	let { tool }: Props = $props();

	const schema = $derived(
		tool.schema as ToolSchema<Record<string, unknown>> | undefined,
	);

	const inputMode = $derived(tool.input);
	const resultKind = $derived(tool.result ?? "image");

	let values = $state<Record<string, unknown>>({});
	let source = $state<PixelImage | null>(null);
	let result = $state<PixelImage | null>(null);
	let fileResult = $state<FileResult | null>(null);
	let textSource = $state("");
	let textResult = $state<string | null>(null);
	let verdictVars = $state<Record<string, string | number> | undefined>(
		undefined,
	);
	let running = $state(false);
	let error = $state("");
	let started = $state(false);

	const debouncedRun = debounce(() => run(), 200);

	function init() {
		if (!schema || started) return;
		started = true;
		values = defaultSchemaParams(schema);
	}

	function setValue(id: string, value: unknown) {
		values = { ...values, [id]: value };
	}

	function reset() {
		values = schema ? defaultSchemaParams(schema) : {};
		result = null;
		fileResult = null;
		textResult = null;
		verdictVars = undefined;
		error = "";
	}

	async function handleFile(file: File) {
		error = "";
		try {
			source = await decodeFile(file);
		} catch (e) {
			error = errorText(e);
		}
	}

	async function run() {
		if (!schema) return;
		error = "";
		running = true;
		try {
			const out = await execute(tool, {
				params: sanitizeSchemaParams(schema, values),
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
			error = errorText(e);
		} finally {
			running = false;
		}
	}

	async function download() {
		if (!schema) return;
		if (resultKind === "files") {
			if (!fileResult) return;
			await downloadZip(fileResult.files, `${tool.id}.zip`);
			return;
		}
		if (!result) return;
		const out = tool.output;
		const quality = out?.qualityParamId
			? Number(values[out.qualityParamId]) / 100
			: undefined;
		const blob = await encode(result, out?.mime ?? "image/png", quality);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${tool.id}.${out?.ext ?? "png"}`;
		a.click();
		URL.revokeObjectURL(url);
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
			error = errorText(e);
		}
	}

	async function downloadText() {
		if (!textResult) return;
		const blob = new Blob([textResult], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${tool.id}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}

	$effect(() => {
		init();
	});

	$effect(() => {
		// TODO: can any edge case start infinite loop?
		if (!started) return;
		void values;
		void source;
		debouncedRun();
		return () => debouncedRun.cancel();
	});

	function errorText(e: unknown): string {
		if (e instanceof ToolError) return t(e.key, e.vars);
		if (e instanceof Error) return e.message;
		return String(e);
	}
</script>

{#if schema}
	<div class="schema-tool">
		<header class="header">
			<div class="title-block">
				<h1>{toolTitle(tool)}</h1>
				<p class="lede">{toolDescription(tool)}</p>
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
					{error}
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
