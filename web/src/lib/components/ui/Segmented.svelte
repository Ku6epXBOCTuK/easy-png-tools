<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		options: Option[];
		value?: string;
		wide?: boolean;
		onchange?: (value: string) => void;
	}
	let {
		options,
		wide = false,
		value = $bindable(),
		onchange,
	}: Props = $props();

	function select(v: string) {
		value = v;
		onchange?.(v);
	}
</script>

<div class="segmented" class:wide role="group">
	{#each options as opt (opt.value)}
		<button
			type="button"
			class="segment"
			class:selected={value === opt.value}
			aria-pressed={value === opt.value}
			onclick={() => select(opt.value)}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style>
	.segmented {
		display: inline-flex;
		border: var(--size-border) solid var(--color-border);
		cursor: pointer;
		&.wide {
			width: 100%;
		}
	}
	.segment {
		border: 0;
		border-right: var(--size-border) solid var(--color-border);
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		background: 0 0;
		padding: var(--space-m);
		flex: 1;
	}
	.segment:last-child {
		border-right: 0px;
	}
	.segment.selected {
		background: var(--color-main);
		color: var(--color-background);
	}
</style>
