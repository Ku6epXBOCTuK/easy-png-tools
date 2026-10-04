<script lang="ts">
	interface Props {
		label: string;
		active?: boolean;
		variant?: "filled" | "outline";
		onclick?: () => void;
	}
	let { label, active = false, variant = "filled", onclick }: Props = $props();
</script>

<button
	type="button"
	class="chip chip--{variant}"
	class:active
	aria-pressed={active}
	onclick={() => onclick?.()}
>
	{label}
</button>

<style>
	.chip {
		border: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-m);
		text-transform: uppercase;
		padding: var(--space-s) var(--space-m);
		border-radius: var(--radius-m);
		cursor: pointer;
	}

	.chip--filled.active {
		background: var(--color-main);
		color: var(--color-background);
		border-color: var(--color-main);
	}

	.chip--outline {
		padding: var(--space-m) 0;
		background: var(--color-background);
		border-radius: var(--radius-s);
		text-transform: none;
	}

	.chip--outline:hover {
		color: var(--color-text);
		border-color: var(--color-main);
	}

	.chip--outline.active {
		color: var(--color-main);
		border-color: var(--color-main);
	}
</style>
