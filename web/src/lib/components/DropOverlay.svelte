<script lang="ts">
	import type { Snippet } from 'svelte';
	import { isSupportedImage, unsupportedImageMessage } from '$lib/core/io';

	interface Props {
		onFile: (file: File) => void;
		onError?: (message: string) => void;
		label?: string;
		children: Snippet;
	}

	let {
		onFile,
		onError,
		label = 'Отпустите файл, чтобы заменить изображение',
		children
	}: Props = $props();

	let depth = $state(0);
	const dragging = $derived(depth > 0);

	function enter() {
		depth += 1;
	}

	function leave() {
		depth = Math.max(0, depth - 1);
	}

	function over(event: DragEvent) {
		event.preventDefault();
	}

	function end() {
		depth = 0;
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		depth = 0;
		const file = event.dataTransfer?.files[0];
		if (!file) return;
		if (!isSupportedImage(file)) {
			onError?.(unsupportedImageMessage(file));
			return;
		}
		onFile(file);
	}
</script>

<div
	class="area"
	class:dragging
	role="region"
	aria-label={label}
	ondragenter={enter}
	ondragleave={leave}
	ondragover={over}
	ondragend={end}
	ondrop={drop}
>
	{@render children()}
	{#if dragging}
		<div class="veil" aria-hidden="true">
			<p>{label}</p>
		</div>
	{/if}
</div>

<style>
	.area {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		flex: 1;
		min-width: 0;
	}

	.veil {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-3);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
		border: 2px dashed var(--accent);
		border-radius: var(--radius-m);
		color: var(--accent);
		font-weight: 600;
		text-align: center;
		pointer-events: none;
	}
</style>
