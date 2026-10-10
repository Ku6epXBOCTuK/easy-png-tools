<script lang="ts">
	import RangeControl from "$lib/components/fields/schema/RangeControl.svelte";
	import Icon from "$lib/components/ui/Icon.svelte";
	import { onDismiss } from "$lib/components/ui/dismiss";
	import type { OutputMime } from "$lib/core/io";
	import { OUTPUT_FORMATS, outputFormatByMime } from "$lib/output-formats";
	import type { SliderSpec } from "$lib/registry-schema";
	import { t } from "$lib/i18n/t";
	import { ChevronDown, Download } from "@lucide/svelte";

	interface Props {
		format: OutputMime;
		quality?: number;
		limitKb?: number;
		running: boolean;
		ondownload: () => void;
		onformat: (mime: OutputMime) => void;
		onquality: (value: number) => void;
		onlimit: (kb: number | undefined) => void;
	}
	let {
		format,
		quality,
		limitKb,
		running,
		ondownload,
		onformat,
		onquality,
		onlimit,
	}: Props = $props();

	const current = $derived(outputFormatByMime(format));
	const qualitySetting = $derived(current.settings?.quality);
	const qualitySpec = $derived(
		qualitySetting
			? ({
					kind: "slider",
					min: qualitySetting.min,
					max: qualitySetting.max,
					step: qualitySetting.step,
					default: qualitySetting.default,
				} satisfies SliderSpec)
			: undefined,
	);

	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);

	function choose(mime: OutputMime) {
		// Menu doubles as a format-settings panel: keep it open on select
		// so quality can be tuned right away.
		onformat(mime);
	}

	function handleLimit(e: Event) {
		const raw = (e.target as HTMLInputElement).valueAsNumber;
		onlimit(Number.isFinite(raw) && raw >= 1 ? Math.round(raw) : undefined);
	}

	$effect(() => {
		if (!open) return;
		return onDismiss(
			() => root,
			() => (open = false),
		);
	});
</script>

<div class="download-split" bind:this={root}>
	<button
		type="button"
		class="main"
		disabled={running}
		onclick={() => {
			open = false;
			ondownload();
		}}
	>
		<Icon icon={Download} size={14} />
		<span>{t("actions.download")}</span>
	</button>
	<button
		type="button"
		class="toggle"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-label={t("actions.formatAria")}
		disabled={running}
		onclick={() => (open = !open)}
	>
		<span>{current.label}</span>
		<Icon icon={ChevronDown} size={14} />
	</button>
	{#if open}
		<div class="menu" role="menu">
			{#each OUTPUT_FORMATS as f (f.mime)}
				<button
					type="button"
					class="item"
					class:selected={f.mime === format}
					role="menuitemradio"
					aria-checked={f.mime === format}
					onclick={() => choose(f.mime)}
				>
					{f.label}
				</button>
			{/each}
			{#if qualitySpec && quality !== undefined}
				<div class="quality">
					<RangeControl
						label={t("fields.quality")}
						value={quality}
						spec={qualitySpec}
						onchange={(q) => onquality(q)}
					/>
				</div>
			{/if}
			<div class="limit">
				<label class="limit-field">
					<span>{t("actions.sizeLimitKb")}</span>
					<input
						type="number"
						min="1"
						step="1"
						placeholder="∞"
						value={limitKb ?? ""}
						oninput={handleLimit}
					/>
				</label>
				{#if limitKb !== undefined && format === "image/bmp"}
					<p class="limit-warn" role="status">
						{t("actions.sizeLimitBmp")}
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.download-split {
		position: relative;
		display: inline-flex;
	}
	.main,
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-xl);
		border: var(--size-border-thick) solid var(--color-main);
		background: var(--color-main);
		color: var(--color-background);
		font-size: var(--font-size-l);
		font-weight: bold;
		cursor: pointer;
	}
	.main {
		border-right: none;
		border-radius: var(--radius-s) 0 0 var(--radius-s);
	}
	.toggle {
		border-radius: 0 var(--radius-s) var(--radius-s) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		font-weight: normal;
	}
	.main:disabled,
	.toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.menu {
		position: absolute;
		top: calc(100% + var(--space-s));
		right: 0;
		z-index: var(--z-dropdown);
		/* Ширина под строку качества: числовое поле + степперы + сброс. */
		min-width: calc(var(--space-xxxl) * 9);
		display: grid;
		gap: var(--space-s);
		padding: var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
	}
	.item {
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid transparent;
		border-radius: var(--radius-s);
		background: transparent;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		text-align: left;
		cursor: pointer;
	}
	.item:hover {
		color: var(--color-text);
		border-color: var(--color-border);
	}
	.item.selected {
		color: var(--color-main);
		border-color: var(--color-main);
	}
	.quality {
		padding-top: var(--space-m);
		border-top: var(--size-border) solid var(--color-border);
	}
	.limit {
		padding-top: var(--space-m);
		border-top: var(--size-border) solid var(--color-border);
	}
	.limit-field {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
	}
	.limit-field input {
		width: calc(var(--space-xxxl) * 3);
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-m) var(--font-mono);
		text-align: center;
		appearance: textfield;
	}
	.limit-field input::-webkit-outer-spin-button,
	.limit-field input::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
	.limit-warn {
		margin: var(--space-m) 0 0;
		color: var(--color-warning);
		font: var(--font-size-s) var(--font-mono);
	}
</style>
