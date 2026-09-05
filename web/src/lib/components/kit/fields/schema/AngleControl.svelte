<script lang="ts">
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
		label = "Angle",
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
			<button
				class:active={preset.value === value}
				onclick={() => onchange(preset.value)}>{preset.label}</button
			>
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
	.angle-presets button {
		padding: var(--space-m) 0;
		color: var(--color-text-muted);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
		cursor: pointer;
	}
	.angle-presets button:hover {
		color: var(--color-text);
		border-color: var(--color-main);
	}
	.angle-presets button.active {
		color: var(--color-main);
		border-color: var(--color-main);
	}
</style>
