<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		options: Option[];
		value?: string;
		onchange?: (value: string) => void;
	}
	let { options, value = $bindable(), onchange }: Props = $props();

	function select(v: string) {
		value = v;
		onchange?.(v);
	}
</script>

<div class="segmented" role="group">
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
		display: flex;
		height: 32px;
		border: 1px solid var(--line);
	}
	.segment {
		border: 0;
		border-right: 1px solid var(--line);
		color: var(--muted);
		font: 10px var(--font-mono);
		background: 0 0;
		flex: 1;
	}
	.segment:last-child {
		border-right: 0px;
	}
	.segment.selected {
		background: var(--blue);
		color: #fff;
	}
</style>
