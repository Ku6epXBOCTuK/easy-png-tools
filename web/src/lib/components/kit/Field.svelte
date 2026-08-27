<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		label: string;
		children: Snippet;
		hint?: string;
	}
	let { label, children, hint }: Props = $props();
</script>

<div class="field">
	<MonoLabel>{label}</MonoLabel>
	<div class="field-control">{@render children()}</div>
	{#if hint}<span class="field-hint">{hint}</span>{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.field-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.field-hint {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--muted);
	}
</style>
