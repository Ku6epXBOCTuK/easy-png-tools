<script lang="ts">
	import { GripVertical, X } from "@lucide/svelte";
	import IconButton from "$lib/components/ui/IconButton.svelte";
	import { t } from "$lib/i18n/t";
	import type { Snippet } from "svelte";

	interface Props {
		index: number;
		title?: string;
		type?: string;
		draggable?: boolean;
		tools?: Snippet;
		children?: Snippet;
		onremove?: () => void;
		ondragstart?: (e: DragEvent) => void;
		ondragover?: (e: DragEvent) => void;
		ondrop?: (e: DragEvent) => void;
		ondragend?: () => void;
	}

	let {
		index,
		title,
		type,
		draggable = false,
		tools,
		children,
		onremove,
		ondragstart,
		ondragover,
		ondrop,
		ondragend,
	}: Props = $props();
</script>

<article
	class="step-card"
	{draggable}
	ondragstart={(e) => ondragstart?.(e)}
	ondragover={(e) => ondragover?.(e)}
	ondrop={(e) => ondrop?.(e)}
	ondragend={() => ondragend?.()}
>
	<header class="step-head">
		<span class="step-index">{index.toString().padStart(2, "0")}</span>
		<GripVertical size={16} class="drag" aria-hidden="true" />
		<div class="step-heading-text">
			{#if type}<span class="step-type">{type}</span>{/if}
			{#if title}<h2 class="step-title">{title}</h2>{/if}
		</div>
		<div class="step-tools">
			{#if tools}{@render tools()}{/if}
			{#if onremove}
				<IconButton
					icon={X}
					label={t("chain.removeStepAria")}
					variant="clear"
					size="s"
					onclick={() => onremove()}
				/>
			{/if}
		</div>
	</header>
	{#if children}
		<div class="step-body">
			{@render children()}
		</div>
	{/if}
</article>

<style>
	.step-card {
		border: var(--size-border) solid var(--color-border);
		background: var(--color-panel);
	}
	.step-head {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-xl);
		border-bottom: var(--size-border) solid var(--color-border);
	}
	.step-index {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-main);
	}
	.step-heading-text {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: var(--space-m);
	}
	.step-type {
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		letter-spacing: var(--space-text-xl);
	}
	.step-title {
		margin: 0;
		font: 600 var(--font-size-m) var(--font-mono);
		color: var(--color-text);
	}
	.step-tools {
		display: flex;
		align-items: center;
		gap: var(--space-l);
	}
	.step-body {
		padding: var(--space-l) var(--space-xl) var(--space-xl);
	}
	.step-card :global(.drag) {
		color: var(--color-border);
		cursor: grab;
	}
</style>
