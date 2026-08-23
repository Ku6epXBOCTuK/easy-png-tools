<script lang="ts">
	import { rgbToHex } from '$lib/core/color';
	import type { PixelImage } from '$lib/core/types';

	interface Props {
		image: PixelImage | null;
		pipetteActive?: boolean;
		onPickColor?: (hex: string) => void;
	}

	let { image, pipetteActive = false, onPickColor }: Props = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();

	$effect(() => {
		if (!canvas || !image) return;
		canvas.width = image.width;
		canvas.height = image.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
	});

	function pickColor(event: MouseEvent) {
		if (!pipetteActive || !onPickColor || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;
		const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
		const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
		if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
		onPickColor(rgbToHex(r, g, b));
	}
</script>

{#if image}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<canvas
		bind:this={canvas}
		title="{image.width} × {image.height}"
		class:pipette={pipetteActive}
		onclick={pickColor}
	></canvas>
	<p class="dims">{image.width} × {image.height} px</p>
{/if}

<style>
	canvas {
		display: block;
		max-width: 100%;
		max-height: 32rem;
		background:
			repeating-conic-gradient(var(--check-a) 0% 25%, var(--check-b) 0% 50%);
		background-size: 16px 16px;
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
	}

	canvas.pipette {
		cursor: crosshair;
	}

	.dims {
		margin-top: var(--space-1);
		color: var(--text-muted);
		font-size: var(--text-s);
	}
</style>
