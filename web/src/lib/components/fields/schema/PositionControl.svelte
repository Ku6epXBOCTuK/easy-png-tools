<script lang="ts">
	import type { Position9 } from "$lib/core/textdraw";
	import { POSITION9_VALUES, type Position9Spec } from "$lib/registry-schema";
	import Control from "./Control.svelte";

	interface Props {
		label: string;
		value: unknown;
		spec: Position9Spec;
		onchange?: (value: Position9) => void;
	}
	let { label, value, spec, onchange }: Props = $props();

	const sp = $derived(spec);
	const current = $derived(
		typeof value === "string" &&
			(POSITION9_VALUES as readonly string[]).includes(value)
			? (value as Position9)
			: sp.default,
	);
</script>

<Control {label} caps>
	<div class="grid">
		{#each POSITION9_VALUES as position (position)}
			<button
				type="button"
				class="cell {current === position ? 'active' : ''}"
				aria-label={position}
				aria-pressed={current === position}
				onclick={() => onchange?.(position)}
			>
				<span class="dot"></span>
			</button>
		{/each}
	</div>
</Control>

<style>
	.grid {
		display: inline-grid;
		grid-template-columns: repeat(3, var(--space-xl));
		gap: var(--space-s);
	}
	.cell {
		display: grid;
		place-items: center;
		width: var(--space-xl);
		height: var(--space-xl);
		padding: 0;
		background: var(--color-background);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		cursor: pointer;
	}
	.cell:hover {
		border-color: var(--color-main);
	}
	.dot {
		width: var(--space-s);
		height: var(--space-s);
		border-radius: 50%;
		background: var(--color-border);
	}
	.active {
		border-color: var(--color-main);
		background: var(--color-main);
	}
	.active .dot {
		background: var(--color-text);
	}
</style>
