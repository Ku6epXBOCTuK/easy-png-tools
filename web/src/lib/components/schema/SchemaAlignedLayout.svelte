<script lang="ts">
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import Toggle from "$lib/components/ui/Toggle.svelte";
	import { toDataUrl, type OutputMime } from "$lib/core/io";
	import type { PixelImage } from "$lib/core/types";
	import { t } from "$lib/i18n/t";
	import type { ChainStep } from "$lib/pipeline.svelte";
	import type {
		FileResult,
		InputMode,
		ResultKind,
		ResultNote,
		ToolImageFile,
	} from "$lib/registry";
	import type { Snippet } from "svelte";
	import AddStepButton from "./AddStepButton.svelte";
	import PartsGrid from "./PartsGrid.svelte";
	import PreviewTile from "./PreviewTile.svelte";
	import SchemaActions from "./SchemaActions.svelte";
	import SchemaResultTile from "./SchemaResultTile.svelte";
	import SchemaSourceTile from "./SchemaSourceTile.svelte";

	interface Props {
		steps: ChainStep[];
		stepCard: Snippet<[ChainStep, number]>;
		canExtend: boolean;
		aligned: boolean;
		inputMode: InputMode;
		source: PixelImage | null;
		sourceFiles: ToolImageFile[];
		textSource: string;
		running: boolean;
		resultKind: ResultKind;
		result: PixelImage | null;
		resultNote: ResultNote | null;
		fileResult: FileResult | null;
		textResult: string | null;
		textVars: Record<string, string | number> | undefined;
		toolId: string;
		format: OutputMime;
		quality: number | undefined;
		limitKb: number | undefined;
		alphaLoss: boolean;
		errorText: string;
		warnings: string[];
		stepResults: (PixelImage | null)[];
		stepFileSets: ToolImageFile[][];
		stepMasks: (PixelImage | null)[];
		stepMaskOn: boolean[];
		stepMaskable: boolean[];
		onaddstep: (index: number, toolId: string) => void;
		ontogglestepmask: (index: number) => void;
		ontextinput: (text: string) => void;
		onrendertext: () => void;
		onupload: (file: File) => void;
		onuploadmany: (files: File[]) => void;
		ondownload: () => void;
		oncopy: () => void;
		ondownloadtxt: () => void;
		onformat: (mime: OutputMime) => void;
		onquality: (value: number) => void;
		onlimit: (kb: number | undefined) => void;
	}
	let {
		steps,
		stepCard,
		canExtend,
		aligned = $bindable(false),
		inputMode,
		source,
		sourceFiles,
		textSource,
		running,
		resultKind,
		result,
		resultNote,
		fileResult,
		textResult,
		textVars,
		toolId,
		format,
		quality,
		limitKb,
		alphaLoss,
		errorText,
		warnings,
		stepResults,
		stepFileSets,
		stepMasks,
		stepMaskOn,
		stepMaskable,
		onaddstep,
		ontogglestepmask,
		ontextinput,
		onrendertext,
		onupload,
		onuploadmany,
		ondownload,
		oncopy,
		ondownloadtxt,
		onformat,
		onquality,
		onlimit,
	}: Props = $props();
</script>

{#snippet maskChip(i: number)}
	{#if stepMaskable[i]}
		<ChipButton
			label={t("resultCard.maskToggle")}
			active={stepMaskOn[i]}
			onclick={() => ontogglestepmask(i)}
		/>
	{/if}
{/snippet}

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
				{quality}
				{limitKb}
				{alphaLoss}
				{onupload}
				{ondownload}
				{onformat}
				{onquality}
				{onlimit}
			/>
		</div>
	</div>
	{#if errorText}
		<p class="error" role="alert">{errorText}</p>
	{/if}
	{#each warnings as w (w)}
		<p class="warn" role="status">{w}</p>
	{/each}
	{#if canExtend}
		<div class="aligned-row">
			<AddStepButton onadd={(id) => onaddstep(0, id)} />
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
						sources={sourceFiles}
						{textSource}
						{running}
						fileCount={sourceFiles.length}
						{ontextinput}
						{onrendertext}
						{onupload}
						{onuploadmany}
					/>
				{:else}
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
				{#if i === steps.length - 1}
					<SchemaResultTile
						{resultKind}
						result={out}
						{resultNote}
						{fileResult}
						{textResult}
						{textVars}
						{toolId}
						{running}
						mask={stepMasks[i] ?? null}
						maskOn={stepMaskOn[i] ?? false}
						ontogglemask={stepMaskable[i]
							? () => ontogglestepmask(i)
							: undefined}
						{oncopy}
						{ondownloadtxt}
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
									stepMaskOn[i] && stepMasks[i] ? stepMasks[i]! : out,
								)}
								alt=""
							/>
						{:else}
							<span class="empty">{t("resultCard.noResult")}</span>
						{/if}
					</PreviewTile>
				{/if}
			</div>
		</div>
		{#if canExtend}
			<div class="aligned-row">
				<AddStepButton onadd={(id) => onaddstep(i + 1, id)} />
				<div
					class="panel-segment connect-segment"
					class:add-last={i === steps.length - 1}
				></div>
			</div>
		{/if}
	{/each}
</div>

<style>
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
	.warn {
		margin: 0;
		color: var(--color-warning);
		font: var(--font-size-s) var(--font-mono);
	}
	.empty {
		font: var(--font-size-s) var(--font-mono);
	}
	@media (--bp-tablet) {
		.aligned-row {
			grid-template-columns: 1fr;
		}
	}
</style>
