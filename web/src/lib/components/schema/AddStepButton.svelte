<script lang="ts">
	import Icon from "$lib/components/ui/Icon.svelte";
	import { pageTitle } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { chainablePages } from "$lib/pipeline.svelte";
	import type { Page } from "$lib/registry";
	import { Plus } from "@lucide/svelte";

	interface Props {
		onadd: (toolId: string) => void;
	}
	let { onadd }: Props = $props();

	const pages = chainablePages();

	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);

	function choose(page: Page) {
		onadd(page.steps[0].id);
		open = false;
	}

	$effect(() => {
		if (!open) return;
		function onPointerDown(e: PointerEvent) {
			if (!root?.contains(e.target as Node)) open = false;
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") open = false;
		}
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("keydown", onKey);
		};
	});
</script>

<div class="add-step" bind:this={root}>
	<button
		type="button"
		class="add-btn"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<Icon icon={Plus} size={14} />
		<span>{t("chain.addStep")}</span>
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
	.add-step {
		position: relative;
		display: flex;
		justify-content: flex-end;
		margin: var(--space-s) 0;
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
