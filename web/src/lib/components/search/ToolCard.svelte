<script lang="ts">
	import { TOOL_ICONS } from '$lib/tools/tool-icons';

	interface Props {
		toolId: string;
		title: string;
		description: string;
		selected?: boolean;
		href?: string;
		onActivate?: () => void;
		onHover?: () => void;
	}

	let {
		toolId,
		title,
		description,
		selected = false,
		href,
		onActivate,
		onHover
	}: Props = $props();

	const Icon = $derived(TOOL_ICONS[toolId]);
</script>

{#snippet content()}
	<span class="icon-box" aria-hidden="true">
		{#if Icon}<Icon size={24} strokeWidth={1.75} />{/if}
	</span>
	<span class="text">
		<span class="title">{title}</span>
		<span class="hint text-caption text-muted">{description}</span>
	</span>
{/snippet}

{#if href}
	<a
		{href}
		class="card"
		class:selected
		onmousemove={onHover}
	>
		{@render content()}
	</a>
{:else}
	<div
		class="card"
		class:selected
		role="option"
		aria-selected={selected}
		tabindex="-1"
		onclick={onActivate}
		onmousemove={onHover}
		onkeydown={(e) => {
			if (e.key === 'Enter') onActivate?.();
		}}
	>
		{@render content()}
	</div>
{/if}

<style>
	.card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		min-width: 0;
		padding: var(--space-2);
		border: 1px solid transparent;
		border-radius: var(--radius-s);
		cursor: pointer;
		color: inherit;
		text-decoration: none;
	}

	.card:hover,
	.card.selected {
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
		border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
	}

	.icon-box {
		flex: none;
		width: 2.6rem;
		height: 2.6rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-s);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
		color: var(--link);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.title {
		font-weight: 600;
		font-size: var(--text-m);
	}

	.hint {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
