<script lang="ts">
	import ChipButton from "$lib/components/ui/ChipButton.svelte";
	import { t } from "$lib/i18n/t";

	interface Preset {
		value: number;
		label: string;
	}

	interface Props {
		label?: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		presets?: Preset[];
		onchange: (angle: number) => void;
	}

	let {
		label = t("ui.angle"),
		value,
		min = 0,
		max = 360,
		step = 1,
		presets = [
			{ value: 0, label: "0°" },
			{ value: 90, label: "90°" },
			{ value: 180, label: "180°" },
			{ value: 270, label: "270°" },
		],
		onchange,
	}: Props = $props();
</script>

<div class="angle-control">
	{#if label}
		<span class="angle-label">{label}</span>
	{/if}
	<div class="angle-row">
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			oninput={(e) => onchange(Number((e.target as HTMLInputElement).value))}
		/>
		<output>{value}°</output>
	</div>
	<div class="angle-presets">
		{#each presets as preset (preset.value)}
			<ChipButton
				label={preset.label}
				variant="outline"
				active={preset.value === value}
				onclick={() => onchange(preset.value)}
			/>
		{/each}
	</div>
</div>

<style>
	.angle-control {
		display: grid;
		gap: var(--space-m);
	}
	.angle-label {
		color: var(--color-text);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-l);
		text-transform: uppercase;
	}
	.angle-row {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: var(--space-m);
	}
	.angle-row input[type="range"] {
		width: 100%;
		accent-color: var(--color-main);
	}
	.angle-row output {
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
	}
	.angle-presets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-m);
	}
</style>
