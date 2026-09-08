<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		title: string;
		eyebrow?: string;
		actions?: Snippet;
	}
	let { title, eyebrow, actions }: Props = $props();
</script>

<header class="panel-heading">
	<div class="heading-text">
		{#if eyebrow}<MonoLabel accent>{eyebrow}</MonoLabel>{/if}
		<strong class="heading-title">{title}</strong>
	</div>
	{#if actions}<div class="heading-actions">{@render actions()}</div>{/if}
</header>

<style>
	.panel-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xl);
		padding: var(--space-l) var(--space-xl);
		border-bottom: var(--size-border) solid var(--color-border);
		margin-bottom: var(--space-m);
	}
	.heading-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}
	.heading-title {
		font-size: var(--font-size-m);
		font-weight: 600;
		color: var(--color-text);
	}
</style>
