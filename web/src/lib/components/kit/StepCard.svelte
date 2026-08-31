<script lang="ts">
	import { Ellipsis, GripVertical, X } from "@lucide/svelte";
	import type { Snippet } from "svelte";

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
		grid-template-columns: 46px 20px 1fr;
		min-height: 138px;
		border: 1px solid var(--line);
		background: var(--panel);
		overflow: hidden;
	}
	.step-index {
		font: 11px var(--font-mono);
		color: var(--blue);
		padding: 17px 0 0px 15px;
		border-right: 1px solid var(--line);
	}
	.step-body {
		padding: 15px 18px 18px;
	}
	.step-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		border-bottom: 1px solid var(--line);
	}
	.step-type {
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
	}
	.step-title {
		margin: 5px 0 18px;
		font: 600 15px var(--font-mono);
		color: var(--foreground);
	}
	.step-tools {
		display: flex;
		align-items: center;
		gap: 13px;
	}
	.step-remove {
		border: 0;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		line-height: inherit;
		& :global(svg) {
			display: block;
			line-height: inherit;
		}
	}
	.step-card :global(.drag) {
		margin-top: 17px;
		color: var(--line);
	}
	.step-remove:hover {
		color: var(--danger);
	}
	.step-body > :not(.step-heading) {
		padding: 0.75rem;
	}
</style>
