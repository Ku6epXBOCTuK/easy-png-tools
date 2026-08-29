<script lang="ts">
	import type { Snippet } from "svelte";
	import { GripVertical, X, Ellipsis } from "@lucide/svelte";

	interface Props {
		index: number;
		title?: string;
		type?: string;
		tools?: Snippet;
		children?: Snippet;
		onremove?: () => void;
	}

	let { index, title, type, tools, children, onremove }: Props = $props();
</script>

<article class="step-card">
	<div class="step-index">{index.toString().padStart(2, "0")}</div>
	<GripVertical size={16} class="drag" aria-hidden="true" />
	<div class="step-body">
		<div class="step-heading">
			<div class="step-heading-text">
				{#if type}<span class="step-type">{type}</span>{/if}
				{#if title}<h2 class="step-title">{title}</h2>{/if}
			</div>
			<div class="step-tools">
				{#if tools}{@render tools()}{/if}
				<button
					type="button"
					class="step-remove"
					aria-label="Remove step"
					onclick={() => onremove?.()}
				>
					<X size={16} />
				</button>
				<Ellipsis size={17} />
			</div>
		</div>
		{#if children}
			{@render children()}
		{/if}
	</div>
</article>

<style>
	.step-card {
		display: grid;
		grid-template-columns: 46px 1fr;
		grid-template-rows: auto 1fr;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--panel);
		overflow: hidden;
	}
	.step-index {
		grid-column: 1;
		grid-row: 1;
		font: 600 22px var(--font-mono);
		line-height: 1;
		color: var(--blue);
		padding: 17px 0 6px 15px;
		border-right: 1px solid var(--line);
	}
	.drag {
		grid-column: 1;
		grid-row: 2;
		color: var(--muted);
		cursor: grab;
		display: inline-flex;
		padding: 0 0 17px 15px;
		border-right: 1px solid var(--line);
	}
	.step-body {
		grid-column: 2;
		grid-row: 1 / span 2;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.step-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--line);
	}
	.step-heading-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.step-type {
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.step-title {
		margin: 5px 0 18px;
		font: 600 15px var(--font-mono);
		color: var(--foreground);
	}
	.step-tools {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.step-remove {
		border: none;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		display: inline-flex;
	}
	.step-remove:hover {
		color: var(--danger);
	}
	.step-body > :not(.step-heading) {
		padding: 0.75rem;
	}
</style>
