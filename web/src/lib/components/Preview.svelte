<script lang="ts">
	import type { PixelImage } from '$lib/core/types';

	let { image }: { image: PixelImage | null } = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();

	$effect(() => {
		if (!canvas || !image) return;
		canvas.width = image.width;
		canvas.height = image.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
	});
</script>

{#if image}
	<canvas bind:this={canvas} title="{image.width} × {image.height}"></canvas>
	<p class="dims">{image.width} × {image.height} px</p>
{/if}

<style>
	canvas {
		display: block;
		max-width: 100%;
		max-height: 24rem;
		background:
			repeating-conic-gradient(var(--check-a) 0% 25%, var(--check-b) 0% 50%);
		background-size: 16px 16px;
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
	}

	.dims {
		margin-top: var(--space-1);
		color: var(--text-muted);
		font-size: 0.85rem;
	}
</style>
