<script lang="ts">
	import { X } from "@lucide/svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import IconButton from "$lib/components/ui/IconButton.svelte";
	import { t } from "$lib/i18n/t";
	import type {
		ColorList,
		ColorListSpec,
		FieldSpec,
	} from "$lib/registry-schema";
	import Control from "./Control.svelte";

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

<Control {label} caps>
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
				<IconButton
					icon={X}
					label={t("ui.removeColor")}
					variant="clear"
					size="s"
					onclick={() => removeColor(i)}
					disabled={current.length <= 1}
				/>
			</div>
		{/each}
	</div>
	<div class="add-row">
		<Button
			label={t("ui.addColor")}
			variant="outline"
			size="s"
			onclick={addColor}
		/>
	</div>
</Control>

<style>
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
	.add-row {
		display: flex;
		justify-content: flex-start;
	}
</style>
