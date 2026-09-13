<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type {
		ColorList,
		ColorListSpec,
		FieldSpec,
	} from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: ColorList) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as ColorListSpec);
	const current = $derived.by((): ColorList => {
		if (Array.isArray(value)) {
			const valid = value.filter(
				(c): c is string => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c),
			);
			if (valid.length > 0) return valid;
		}
		return [...sp.default];
	});

	function setColor(index: number, hex: string) {
		const next = [...current];
		next[index] = hex;
		onchange?.(next);
	}

	function addColor() {
		onchange?.([...current, "#000000"]);
	}

	function removeColor(index: number) {
		if (current.length <= 1) return;
		onchange?.(current.filter((_, i) => i !== index));
	}
</script>

<div class="control colors-control">
	<span class="ctrl-label">{label}</span>
	<div class="chips">
		{#each current as hex, i (i)}
			<div class="chip">
				<label class="swatch-wrap">
					<span class="swatch" style="background:{hex}"></span>
					<input
						type="color"
						value={hex}
						oninput={(e) => setColor(i, (e.target as HTMLInputElement).value)}
					/>
				</label>
				<span class="hex">{hex}</span>
				<button
					type="button"
					class="remove"
					onclick={() => removeColor(i)}
					disabled={current.length <= 1}
					aria-label={t("ui.removeColor")}
				>
					×
				</button>
			</div>
		{/each}
	</div>
	<button type="button" class="add" onclick={addColor}
		>{t("ui.addColor")}</button
	>
</div>

<style>
	.control {
		display: grid;
		gap: var(--space-m);
		margin-bottom: var(--space-xl);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}
	.ctrl-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-m);
	}
	.chip {
		display: grid;
		grid-template-columns: var(--space-xxl) minmax(0, auto) auto;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-s) var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
	}
	.swatch-wrap {
		display: grid;
		position: relative;
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	.swatch-wrap input[type="color"] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}
	.hex {
		color: var(--color-text-muted);
		font-size: var(--font-size-s);
	}
	.remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--space-xl);
		height: var(--space-xl);
		border: none;
		border-radius: var(--radius-s);
		background: none;
		color: var(--color-text-muted);
		font-size: var(--font-size-s);
		cursor: pointer;
	}
	.remove:hover:not(:disabled) {
		color: var(--color-text);
		background: var(--color-background-muted);
	}
	.remove:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.add {
		justify-self: start;
		padding: var(--space-s) var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: none;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.add:hover {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}
</style>
