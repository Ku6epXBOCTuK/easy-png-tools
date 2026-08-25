<script lang="ts">
	import Field from './Field.svelte';
	import { t } from '$lib/i18n/t';

	interface Props {
		id: string;
		label: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		default?: number;
		hint?: string;
	}

	let {
		id,
		label,
		value = $bindable(0),
		min,
		max,
		step,
		default: defaultValue,
		hint
	}: Props = $props();

	function decrement() {
		if (min !== undefined && value <= min) return;
		value = Math.max(min ?? -Infinity, value - (step ?? 1));
	}

	function increment() {
		if (max !== undefined && value >= max) return;
		value = Math.min(max ?? Infinity, value + (step ?? 1));
	}

	function reset() {
		if (defaultValue !== undefined) value = defaultValue;
	}

	const resetDisabled = $derived(defaultValue === undefined || value === defaultValue);
</script>

<Field {id} {label} {hint}>
	<div class="row">
		<button type="button" class="step" aria-label={t('ui.decrease')} onclick={decrement}>−</button>
		<input id={id} type="range" min={min} max={max} step={step} bind:value />
		<button type="button" class="step" aria-label={t('ui.increase')} onclick={increment}>+</button>
		<button
			type="button"
			class="step"
			aria-label={t('ui.reset')}
			disabled={resetDisabled}
			onclick={reset}
		>
			↺
		</button>
		<output>{value}</output>
	</div>
</Field>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		width: 100%;
		max-width: 22rem;
	}

	input[type='range'] {
		flex: 1;
		min-width: 3rem;
		accent-color: var(--accent);
		margin: 0;
	}

	.step {
		flex: none;
		width: 1.5rem;
		height: 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		color: var(--text);
		font-size: 0.85rem;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.step:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}

	.step:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	output {
		flex: none;
		min-width: 3ch;
		text-align: right;
		font-family: var(--font-mono);
		font-size: var(--text-s);
	}
</style>
