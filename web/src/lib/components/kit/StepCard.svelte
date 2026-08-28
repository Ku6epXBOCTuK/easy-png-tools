<script lang="ts">
	import type { Snippet } from "svelte";
	import { GripVertical, X } from "@lucide/svelte";

	interface Props {
		index: number;
		title?: string;
		type?: string;
		children?: Snippet;
		onremove?: () => void;
	}
	let { index, title, type, children, onremove }: Props = $props();
</script>

<div class="step-card">
	<div class="step-heading">
		<span class="drag" aria-hidden="true"><GripVertical size={16} /></span>
		<span class="step-index">{index.toString().padStart(2, "0")}</span>
		{#if type}<span class="step-type">{type}</span>{/if}
		{#if title}<span class="step-title">{title}</span>{/if}
		<button
			type="button"
			class="step-remove"
			aria-label="Remove step"
			onclick={() => onremove?.()}
		>
			<X size={16} />
		</button>
	</div>
	{#if children}
		<div class="step-body">{@render children()}</div>
	{/if}
</div>

<style>
	.step-card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--panel);
	}
	.step-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--line);
	}
	.drag {
		color: var(--muted);
		cursor: grab;
		display: inline-flex;
	}
	.step-index {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--blue);
	}
	.step-title {
		font: 600 15px var(--font-mono);
		color: var(--foreground);
		margin: 0;
	}
	.step-type {
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.step-remove {
		margin-left: auto;
		border: none;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		display: inline-flex;
	}
	.step-remove:hover {
		color: var(--danger);
	}
	.step-body {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
