<script lang="ts">
	import { ChevronDown } from "@lucide/svelte";

	interface Props {
		label: string;
		value: string;
		dark?: boolean;
		chevron?: boolean;
		oninput?: (value: string) => void;
	}
	let {
		label,
		value = $bindable(),
		dark = false,
		chevron = false,
		oninput,
	}: Props = $props();

	function handle(e: Event) {
		value = (e.target as HTMLInputElement).value;
		oninput?.(value);
	}
</script>

<label class="control-block">
	<span class="control-title">{label}</span>
	<div class="color-field">
		<span class="swatch" class:dark style="background:{value}"></span>
		<input
			type="text"
			aria-label={label}
			{value}
			oninput={handle}
			spellcheck="false"
		/>
		{#if chevron}<ChevronDown class="icon" size={14} />{/if}
	</div>
</label>

<style>
	.control-block :global(.icon) {
		color: var(--color-text);
	}
	.control-title {
		display: flex;
		justify-content: space-between;
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-l);
		color: var(--color-text-muted);
		margin-bottom: var(--space-m);
	}
	.color-field {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding-left: var(--space-m);
		padding-right: var(--space-m);
		height: var(--space-xxxl);
		border: 1px solid var(--color-border);
	}
	.swatch {
		width: var(--space-l);
		height: var(--space-l);
		border: 1px solid var(--color-border);
		flex: none;
	}
	.color-field input {
		min-width: 0;
		color: var(--color-text);
		font: var(--font-size-s) var(--font-mono);
		background: 0 0;
		border: 0;
		outline: 0;
		flex: 1;
	}
	.color-field :global(svg) {
		color: var(--color-text-muted);
		flex: none;
	}
</style>
