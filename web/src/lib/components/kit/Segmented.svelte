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
			class:active={value === opt.value}
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
		height: 32px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--background);
	}
	.segment {
		border: none;
		background: transparent;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0 0.7rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
	}
	.segment + .segment {
		border-left: 1px solid var(--line);
	}
	.segment.active {
		background: var(--blue);
		color: #fff;
	}
</style>
