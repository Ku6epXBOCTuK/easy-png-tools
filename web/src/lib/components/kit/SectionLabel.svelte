<script lang="ts">
	import type { Snippet } from "svelte";
	import MonoLabel from "./MonoLabel.svelte";

	interface Props {
		label: string;
		title: string;
		meta?: string;
		actions?: Snippet;
		unwrapActions?: boolean;
	}

	let { label, title, meta, actions, unwrapActions = false }: Props = $props();
</script>

<div class="section-label">
	<div class="section-text">
		<MonoLabel>{label}</MonoLabel>
		<strong
			>{title}{#if meta}<em>{meta}</em>{/if}</strong
		>
	</div>
	{#if actions}
		{#if unwrapActions}
			{@render actions()}
		{:else}
			<div class="section-actions">
				{@render actions()}
			</div>
		{/if}
	{/if}
</div>

<style>
	.section-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--line);
		padding-bottom: 15px;
	}
	.section-text strong {
		display: block;
		margin-top: 5px;
		font: 600 14px var(--font-mono);
		color: var(--foreground);
	}
	.section-text em {
		color: #25a96a;
		font-style: normal;
		font-size: 10px;
	}
	.section-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}
</style>
