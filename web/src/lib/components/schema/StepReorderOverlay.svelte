<script lang="ts">
	import { chainStepTitle } from "$lib/i18n/schema-tool-strings";
	import type { ChainStep } from "$lib/pipeline.svelte";
	import { GripVertical } from "@lucide/svelte";
	import type { StepDnd } from "./step-dnd.svelte";

	interface Props {
		steps: ChainStep[];
		dnd: StepDnd;
	}
	let { steps, dnd }: Props = $props();

	let listEl = $state<HTMLElement | null>(null);
	$effect(() => {
		dnd.registerList(listEl);
		return () => dnd.registerList(null);
	});

	// Align the overlay so its source row sits exactly under the cursor (the
	// dragged card's grab point); the page behind never moves.
	const top = $derived.by(() => {
		const anchor = dnd.anchor;
		const el = listEl;
		if (!anchor || !el || steps.length === 0) return null;
		const rowH = el.scrollHeight / steps.length;
		const offsetInSource = anchor.startY - anchor.sourceTop;
		const raw = anchor.startY - (dnd.sourceIndex ?? 0) * rowH - offsetInSource;
		const margin = 16;
		const maxTop = window.innerHeight - el.offsetHeight - margin;
		return Math.min(Math.max(raw, margin), Math.max(margin, maxTop));
	});

	const lineTop = $derived.by(() => {
		const slot = dnd.indicatorSlot;
		const el = listEl;
		if (slot === null || !el || steps.length === 0) return null;
		const rowH = el.scrollHeight / steps.length;
		return slot * rowH - el.scrollTop;
	});
</script>

{#if dnd.activeData && dnd.anchor}
	<div class="reorder-scrim" aria-hidden="true"></div>
	<div
		class="reorder-overlay"
		style:left="{dnd.anchor.left}px"
		style:top="{top ?? dnd.anchor.sourceTop}px"
		style:width="{dnd.anchor.width}px"
		style:visibility={top === null ? "hidden" : "visible"}
	>
		<ol class="reorder-list" bind:this={listEl}>
			{#each steps as step, i (step.key)}
				<li class:dimmed={i === dnd.sourceIndex}>
					<GripVertical size={14} aria-hidden="true" />
					<span class="reorder-index">{String(i + 1).padStart(2, "0")}</span>
					<span class="reorder-title">{chainStepTitle(step.id)}</span>
				</li>
			{/each}
		</ol>
		{#if lineTop !== null}
			<div class="reorder-line" style:top="{lineTop}px"></div>
		{/if}
	</div>
{/if}

<style>
	/* The scrim dims the page so the floating list does not blend into the
	   step cards underneath; it never intercepts the drag. */
	.reorder-scrim {
		position: fixed;
		inset: 0;
		z-index: var(--z-dropdown);
		background: var(--color-scrim);
		pointer-events: none;
	}
	.reorder-overlay {
		position: fixed;
		z-index: var(--z-drag);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-height: 60vh;
		border: var(--size-border-thick) solid var(--color-main);
		background: var(--color-panel);
	}
	.reorder-list {
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-y: auto;
	}
	.reorder-list li {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-s) var(--space-l);
		border-bottom: var(--size-border) solid var(--color-border);
		color: var(--color-border);
		white-space: nowrap;
	}
	.reorder-list li:last-child {
		border-bottom: none;
	}
	.reorder-list li.dimmed {
		opacity: 0.45;
	}
	.reorder-index {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-main);
	}
	.reorder-title {
		overflow: hidden;
		text-overflow: ellipsis;
		font: 600 var(--font-size-m) var(--font-mono);
		color: var(--color-text);
	}
	.reorder-line {
		position: absolute;
		right: 0;
		left: 0;
		height: var(--size-border-thick);
		background: var(--color-main);
		pointer-events: none;
	}
</style>
