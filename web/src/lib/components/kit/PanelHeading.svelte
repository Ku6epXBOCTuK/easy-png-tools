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
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--line);
	}
	.heading-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.heading-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--foreground);
	}
</style>
