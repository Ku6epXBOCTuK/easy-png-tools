<script lang="ts">
	import Icon from "$lib/components/ui/Icon.svelte";
	import { onDismiss } from "$lib/components/ui/dismiss";
	import { pageTitle } from "$lib/i18n/schema-tool-strings";
	import { chainablePages } from "$lib/pipeline.svelte";
	import type { Page } from "$lib/registry";
	import { Plus, Repeat } from "@lucide/svelte";

	interface Props {
		label: string;
		iconOnly?: boolean;
		onadd: (toolId: string) => void;
	}
	let { label, iconOnly = false, onadd }: Props = $props();

	const pages = chainablePages();

	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);

	function choose(page: Page) {
		onadd(page.steps[0].id);
		open = false;
	}

	$effect(() => {
		if (!open) return;
		return onDismiss(
			() => root,
			() => (open = false),
		);
	});
</script>

<div class="tool-picker" bind:this={root}>
	<button
		type="button"
		class={iconOnly ? "icon-btn" : "add-btn"}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-label={iconOnly ? label : undefined}
		onclick={() => (open = !open)}
	>
		{#if iconOnly}
			<Icon icon={Repeat} size={14} />
		{:else}
			<Icon icon={Plus} size={14} />
			<span>{label}</span>
		{/if}
	</button>
	{#if open}
		<div class="menu" role="menu">
			{#each pages as page (page.slug)}
				<button
					type="button"
					class="item"
					role="menuitem"
					onclick={() => choose(page)}
				>
					{pageTitle(page)}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tool-picker {
		position: relative;
		display: inline-flex;
	}
	.add-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid var(--color-main);
		border-radius: var(--radius-m);
		background: var(--color-main);
		color: var(--color-background);
		font: 600 var(--font-size-s) var(--font-mono);
		cursor: pointer;
	}
	.add-btn:hover {
		filter: brightness(1.1);
	}
	.icon-btn {
		display: inline-flex;
		align-items: center;
		padding: var(--space-s);
		border: var(--size-border) solid transparent;
		border-radius: var(--radius-m);
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.icon-btn:hover {
		color: var(--color-text);
	}
	.menu {
		position: absolute;
		top: calc(100% + var(--space-s));
		right: 0;
		z-index: var(--z-dropdown);
		min-width: calc(var(--space-xxxl) * 8);
		max-height: calc(var(--space-xxxl) * 8);
		overflow-y: auto;
		display: grid;
		gap: var(--space-s);
		padding: var(--space-m);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
	}
	.item {
		padding: var(--space-m) var(--space-l);
		border: var(--size-border) solid transparent;
		border-radius: var(--radius-s);
		background: transparent;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		text-align: left;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.item:hover {
		color: var(--color-text);
		border-color: var(--color-border);
	}
</style>
