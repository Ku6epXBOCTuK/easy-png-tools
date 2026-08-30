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

<div class="control-block">
	<label>{label}</label>
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
</div>

<style>
	.control-block :global(.icon) {
		color: var(--foreground);
	}
	label {
		display: flex;
		justify-content: space-between;
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.color-field {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-left: 8px;
		padding-right: 8px;
		height: 32px;
	}
	.swatch {
		width: 14px;
		height: 14px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		flex: none;
	}
	.color-field input {
		min-width: 0;
		color: var(--foreground);
		font: 11px var(--font-mono);
		background: 0 0;
		border: 0;
		outline: 0;
		flex: 1;
	}
	.color-field :global(svg) {
		color: var(--muted);
		flex: none;
	}
</style>
