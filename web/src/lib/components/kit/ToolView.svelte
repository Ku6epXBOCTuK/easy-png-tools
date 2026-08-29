<script lang="ts">
	import type { ToolEntry } from "$lib/registry";
	import {
		getPreviewView,
		initForm,
		type FieldValue,
		type PreviewToolView,
		type SegmentedField,
	} from "$lib/preview/tool-views";
	import { Copy, Download, Check, RotateCcw, ChevronDown } from "@lucide/svelte";

	interface Props {
		tool: ToolEntry;
	}
	let { tool }: Props = $props();

	const view = $derived(getPreviewView(tool));
	let form = $state<Record<string, FieldValue>>(view ? initForm(view) : {});
	$effect(() => {
		if (view) form = initForm(view);
	});
	function reset() {
		if (view) form = initForm(view);
	}

	const num = (v: FieldValue) => v as number;
	const str = (v: FieldValue) => v as string;
	const bool = (v: FieldValue) => v as boolean;
	const pair = (v: FieldValue) => v as { from: string; to: string };

	const grad = $derived.by(() => {
		if (!view || view.preview !== "gradient") return null;
		const typeSel = num(form["type"]);
		const type = (view.fields.find((f) => f.id === "type") as SegmentedField).options[typeSel];
		const cp = pair(form["stops"]);
		const dir = num(form["dir"]);
		const op = num(form["op"]);
		const css =
			type === "Radial"
				? `radial-gradient(circle, ${cp.from} 0%, ${cp.to} 100%)`
				: `linear-gradient(${dir}deg, ${cp.from} 0%, ${cp.to} 100%)`;
		return { type, cp, dir, op, css, code: `background: ${css};\nopacity: ${op / 100};` };
	});

	const DIRS = [0, 45, 90, 135, 180, 225, 270, 315];
	const DIR_GLYPHS = ["→", "↗", "↑", "↖", "←", "↙", "↓", "↘"];
	const SUBJECT_BG = "linear-gradient(145deg,#1769d2 0 38%,#00a8c7 38% 66%,#bd7411 66%)";
	const SUBJECT_CLIP = "polygon(23% 11%, 73% 8%, 89% 30%, 79% 81%, 52% 93%, 17% 78%, 8% 39%)";
	const CHECKER = "repeating-conic-gradient(#d7dce0 0 25%, #f3f5f6 0 50%) 50% / 28px 28px";
</script>

{#if view}
	<div class="tool-page">
		<div class="eyebrow">PNG PROCESSING <span>/</span> SINGLE TOOL</div>
		<div class="tool-title">
			<div>
				<h1>{view.title}</h1>
				<p class="lede">{view.lede}</p>
			</div>
			<span class="tool-status"><i></i> LIVE PREVIEW</span>
		</div>

		<div class={view.layoutClass}>
			<section class="settings-panel">
				<div class="panel-heading">
					<div>
						<span class="label">{view.panelLabel}</span>
						<strong>{view.panelStrong}</strong>
					</div>
					<span class="step-type">{view.stepType}</span>
				</div>

				{#each view.fields as f}
					{#if f.kind === "segmented"}
						{@const sel = num(form[f.id])}
						<div class="setting-group">
							<label>{f.label}</label>
							<div class="segmented wide">
								{#each f.options as opt, i}
									<button class={i === sel ? "selected" : ""} onclick={() => (form[f.id] = i)}>
										{opt}
									</button>
								{/each}
							</div>
						</div>
					{:else if f.kind === "color-pair"}
						{@const cp = pair(form[f.id])}
						<div class="setting-group">
							<label>{f.label}</label>
							<div class="color-row">
								<div class="color-field">
									<span class="swatch" style="background:{cp.from}"></span>
									<input
										value={cp.from}
										oninput={(e) => (form[f.id] = { from: e.currentTarget.value, to: cp.to })}
									/>
								</div>
								<span class="stop-arrow">→</span>
								<div class="color-field">
									<span class="swatch" style="background:{cp.to}"></span>
									<input
										value={cp.to}
										oninput={(e) => (form[f.id] = { from: cp.from, to: e.currentTarget.value })}
									/>
								</div>
							</div>
							<div class="gradient-bar" style="background:{grad?.css}"></div>
						</div>
					{:else if f.kind === "slider" || f.kind === "direction"}
						{@const v = num(form[f.id])}
						<div class="setting-group">
							<label>{f.label} <output>{v}{f.space ? " " : ""}{f.suffix}</output></label>
							<input
								type="range"
								min={f.min}
								max={f.max}
								value={v}
								oninput={(e) => (form[f.id] = Number(e.currentTarget.value))}
							/>
							{#if f.kind === "direction"}
								<div class="direction-grid">
									{#each DIRS as a, i}
										<button class={a === v ? "selected" : ""} onclick={() => (form[f.id] = a)}>
											{a}° {DIR_GLYPHS[i]}
										</button>
									{/each}
								</div>
							{:else if f.hints}
								<div class="range-hints">
									<span>{f.hints[0]}</span>
									<span>{f.hints[1]}</span>
								</div>
							{/if}
						</div>
					{:else if f.kind === "color"}
						{@const v = str(form[f.id])}
						<div class="setting-group">
							<label>{f.label}</label>
							<div class="color-field">
								<span class="swatch" style="background:{v}"></span>
								<input value={v} oninput={(e) => (form[f.id] = e.currentTarget.value)} />
								{#if f.native}
									<input
										class="native-color"
										type="color"
										aria-label="Choose background color"
										value={v}
										oninput={(e) => (form[f.id] = e.currentTarget.value)}
									/>
								{/if}
							</div>
							{#if f.reference}
								<div class="color-reference">
									<span style="background:{v}"></span> sampled from image background
								</div>
							{/if}
						</div>
					{:else if f.kind === "toggle"}
						{@const on = bool(form[f.id])}
						<div class="setting-group toggle-group">
							<label>
								<span>{f.label}</span>
								<b class="toggle" class:on onclick={() => (form[f.id] = !on)}></b>
							</label>
							<p>{f.note}</p>
						</div>
					{/if}
				{/each}

				<div class="settings-footer">
					<button class="reset-btn" onclick={reset}>
						<RotateCcw size={14} /> Reset
					</button>
					<span class="auto-note"><i></i> updates automatically</span>
				</div>
			</section>

			{#if view.preview === "gradient"}
				<section class={view.previewClass}>
					<div class="preview-toolbar">
						<div>
							<span class="label">{view.toolbarLabel}</span>
							<strong>{view.fileName}</strong>
						</div>
					<div class="preview-actions">
						<button class="secondary-btn"><Copy size={15} /> Copy CSS</button>
						<button class="download-btn"
							><Download size={15} /> {view.downloadLabel} <ChevronDown size={14} /></button
						>
					</div>
					</div>
					<div class="large-canvas">
						<div
							class="gradient-art"
							style="background:{grad?.css};opacity:{grad ? grad.op / 100 : 1}"
						>
							<div class="art-mark">PNG</div>
							<span>easy-png-tools</span>
						</div>
					</div>
					<div class="code-block">
						<div>
							<span class="label">GENERATED CSS</span>
							<button class="icon-btn" aria-label="Copy CSS"><Copy size={14} /></button>
						</div>
						<pre>{grad?.code}</pre>
					</div>
				</section>
			{:else}
				<section class={view.previewClass}>
					<div class="preview-toolbar">
						<div>
							<span class="label">{view.toolbarLabel}</span>
							<strong>{view.fileName}</strong>
						</div>
						<div class="preview-actions">
							<span class="processed"><Check size={14} /> processed</span>
							<button class="download-btn"><Download size={15} /> Download result</button>
						</div>
					</div>
					<div class="comparison-grid">
						<div class="image-card">
							<div class="image-label"><span>SOURCE</span><b>original.png</b></div>
							<div class="remover-canvas source-canvas">
								<div
									class="subject subject-source"
									style="background:{SUBJECT_BG};opacity:1;clip-path:{SUBJECT_CLIP}"
								>
									<span>OBJECT</span>
								</div>
								<span class="canvas-size">1200 × 800</span>
							</div>
						</div>
						<div class="image-card">
							<div class="image-label"><span>RESULT</span><b>removed-bg.png</b></div>
							<div class="remover-canvas" style="background:{CHECKER}">
								<div
									class="subject"
									style="background:{SUBJECT_BG};opacity:1;clip-path:{SUBJECT_CLIP}"
								>
									<span>PNG</span>
								</div>
								<span class="canvas-size">1200 × 800</span>
							</div>
						</div>
					</div>
					<div class="result-meta">
						<span>FORMAT <b>PNG-24</b></span>
						<span>ALPHA <b>ENABLED</b></span>
						<span>SIMILARITY <b>72 %</b></span>
					</div>
				</section>
			{/if}
		</div>
	</div>
{:else}
	<div class="tool-page">
		<div class="eyebrow">PNG PROCESSING <span>/</span> SINGLE TOOL</div>
		<div class="tool-title">
			<div>
				<h1>{tool.title}</h1>
				<p class="lede">{tool.description}</p>
			</div>
			<span class="tool-status"><i></i> LIVE PREVIEW</span>
		</div>
		<div class="tool-layout">
			<section class="settings-panel">
				<div class="panel-heading">
					<div>
						<span class="label">{tool.category.toUpperCase()} SETTINGS</span>
						<strong>Configure output</strong>
					</div>
					<span class="step-type">TOOL 01</span>
				</div>
				<div class="settings-footer">
					<span class="auto-note"><i></i> preview coming soon</span>
				</div>
			</section>
		</div>
	</div>
{/if}
