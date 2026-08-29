<script lang="ts">
	import { ChevronDown } from "@lucide/svelte";

	interface Props {
		label: string;
		value: string;
		dark?: boolean;
		chevron?: boolean;
		oninput?: (value: string) => void;
	}
	let { label, value = $bindable(), dark = false, chevron = false, oninput }: Props = $props();

	function handle(e: Event) {
		value = (e.target as HTMLInputElement).value;
		oninput?.(value);
	}
</script>

<div class="control-block">
	<label>{label}</label>
	<div class="color-field">
		<span class="swatch" class:dark style="background:{value}"></span>
		<input type="text" aria-label={label} {value} oninput={handle} spellcheck="false" />
		{#if chevron}<ChevronDown size={14} />{/if}
	</div>
</div>

<style>
	.control-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	label {
		font: 10px var(--font-mono);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.color-field {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.swatch {
		width: 1.6rem;
		height: 1.6rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		flex: none;
	}
	.color-field input {
		flex: 1;
		min-width: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--foreground);
		background: var(--background);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.35rem 0.5rem;
		text-transform: uppercase;
	}
	.color-field :global(svg) {
		color: var(--muted);
		flex: none;
	}
</style>
