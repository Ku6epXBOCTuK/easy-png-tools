<script lang="ts">
	import { Ellipsis, GripVertical, X } from "@lucide/svelte";
	import { t } from "$lib/i18n/t";
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
					aria-label={t("chain.removeStepAria")}
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
		grid-template-columns: var(--size-step-index) var(--size-step-grip) 1fr;
		min-height: var(--size-step-min-height);
		border: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
	}
	.step-index {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-main);
		padding: var(--space-xl) 0 0px var(--space-xl);
	}
	.step-body {
		padding: var(--space-xl) var(--space-xl) var(--space-xl);
	}
	.step-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		border-color: var(--color-border);
	}
	.step-type {
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-xl);
	}
	.step-title {
		margin: var(--space-s) 0 var(--space-xl);
		font: 600 var(--font-size-m) var(--font-mono);
		color: var(--color-text);
	}
	.step-tools {
		display: flex;
		align-items: center;
		gap: var(--space-l);
	}
	.step-remove {
		border: 0;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		line-height: inherit;
		& :global(svg) {
			display: block;
			line-height: inherit;
		}
	}
	.step-card :global(.drag) {
		margin-top: var(--space-xl);
		color: var(--color-border);
	}
	.step-remove:hover {
		color: var(--color-danger);
	}
	.step-body > :not(.step-heading) {
		padding: var(--space-l);
	}
</style>
