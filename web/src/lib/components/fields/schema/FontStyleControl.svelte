<script lang="ts">
	import { t } from "$lib/i18n/t";
	import type { TextFont } from "$lib/core/domText";
	import type {
		FieldSpec,
		FontStyle,
		FontStyleSpec,
	} from "$lib/registry-schema";

	interface Props {
		label: string;
		value: unknown;
		spec: FieldSpec;
		onchange?: (value: FontStyle) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec as FontStyleSpec);
	const current = $derived.by(() => {
		const v = value as Partial<FontStyle> | undefined;
		return {
			font:
				v?.font === "sans" || v?.font === "serif" || v?.font === "mono"
					? v.font
					: sp.font,
			size:
				typeof v?.size === "number" && Number.isFinite(v.size)
					? v.size
					: sp.size,
			bold: typeof v?.bold === "boolean" ? v.bold : sp.bold,
			color: typeof v?.color === "string" ? v.color : sp.color,
		};
	});

	function set<K extends keyof FontStyle>(key: K, val: FontStyle[K]) {
		onchange?.({ ...current, [key]: val });
	}

	const FONTS: { value: TextFont; labelKey: string }[] = [
		{ value: "sans", labelKey: "ui.fontSans" },
		{ value: "serif", labelKey: "ui.fontSerif" },
		{ value: "mono", labelKey: "ui.fontMono" },
	];
</script>

<div class="control font-style-control">
	<span class="fs-label">{label}</span>
	<div class="fs-grid">
		<label class="fs-cell">
			<span class="fs-sub">{t("ui.font")}</span>
			<select
				class="fs-select"
				value={current.font}
				oninput={(e) =>
					set("font", (e.target as HTMLSelectElement).value as TextFont)}
			>
				{#each FONTS as option (option.value)}
					<option value={option.value}>{t(option.labelKey)}</option>
				{/each}
			</select>
		</label>
		<label class="fs-cell">
			<span class="fs-sub">{t("ui.size")}</span>
			<input
				class="fs-input"
				type="number"
				min={sp.min}
				max={sp.max}
				value={current.size}
				oninput={(e) =>
					set("size", Number((e.target as HTMLInputElement).value))}
			/>
		</label>
		<label class="fs-cell">
			<span class="fs-sub">{t("ui.color")}</span>
			<span class="fs-color">
				<span class="swatch" style="background:{current.color}"></span>
				<input
					class="fs-color-input"
					type="color"
					value={current.color}
					oninput={(e) => set("color", (e.target as HTMLInputElement).value)}
				/>
			</span>
		</label>
		<label class="fs-cell fs-bold">
			<span class="fs-sub">{t("ui.bold")}</span>
			<input
				type="checkbox"
				checked={current.bold}
				onchange={(e) => set("bold", (e.target as HTMLInputElement).checked)}
			/>
		</label>
	</div>
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
	.fs-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.fs-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
	}
	.fs-cell {
		display: grid;
		gap: var(--space-m);
	}
	.fs-sub {
		font-size: var(--font-size-s);
	}
	.fs-select,
	.fs-input,
	.fs-color-input {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
	}
	.fs-color {
		display: grid;
		grid-template-columns: var(--space-xxl) 1fr;
		align-items: center;
		gap: var(--space-m);
	}
	.swatch {
		width: var(--space-xxl);
		height: var(--space-xxl);
		border-radius: var(--radius-s);
		border: var(--size-border) solid var(--color-border);
	}
	.fs-color-input {
		height: var(--space-xxl);
		padding: 0;
		cursor: pointer;
	}
	.fs-bold {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}
	.fs-bold input[type="checkbox"] {
		width: var(--space-xl);
		height: var(--space-xl);
		accent-color: var(--color-main);
	}
</style>
