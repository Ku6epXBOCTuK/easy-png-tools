<script lang="ts">
	import type { Component } from "svelte";
	import { Upload } from "@lucide/svelte";

	interface Props {
		name: string;
		size?: string;
		icon?: Component<{ size?: number }>;
	}

	let { name, size, icon = Upload }: Props = $props();
	const Cmp = $derived(icon);
</script>

<div class="file-chip">
	<Cmp size={15} />
	<span>{name}</span>
	{#if size}<b>{size}</b>{/if}
</div>

<style>
	.file-chip {
		display: flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
		border: 1px solid var(--line);
		background: var(--panel);
		font: 11px var(--font-mono);
		color: var(--muted);
		padding: 10px 12px;
	}
	.file-chip b {
		color: var(--blue);
		font-weight: 500;
	}
</style>
