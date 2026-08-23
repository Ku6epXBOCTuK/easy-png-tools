<script lang="ts">
	import { rgbToHex } from '$lib/core/color';
	import type { PixelImage } from '$lib/core/types';
	import PipetteLoupe from './tool/PipetteLoupe.svelte';

	interface Props {
		image: PixelImage | null;
		pipetteActive?: boolean;
		onPickColor?: (hex: string) => void;
	}

	let { image, pipetteActive = false, onPickColor }: Props = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();
	let hover = $state<{ clientX: number; clientY: number; px: number; py: number; hex: string } | null>(
		null
	);

	$effect(() => {
		if (!canvas || !image) return;
		canvas.width = image.width;
		canvas.height = image.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.putImageData(new ImageData(image.data, image.width, image.height), 0, 0);
	});

	function pixelAt(event: MouseEvent): { px: number; py: number; hex: string } | null {
		if (!canvas || !image) return null;
		const rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return null;
		const px = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
		const py = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
		if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) return null;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;
		return { px, py, hex: rgbToHex(r, g, b) };
	}

	function pickColor(event: MouseEvent) {
		if (!pipetteActive || !onPickColor) return;
		const pixel = pixelAt(event);
		if (pixel) {
			onPickColor(pixel.hex);
		}
	}

	function trackHover(event: MouseEvent) {
		if (!pipetteActive) {
			hover = null;
			return;
		}
		const pixel = pixelAt(event);
		hover = pixel
			? { clientX: event.clientX, clientY: event.clientY, px: pixel.px, py: pixel.py, hex: pixel.hex }
			: null;
	}

	function clearHover() {
		hover = null;
	}
</script>

{#if image}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<canvas
		bind:this={canvas}
		title="{image.width} × {image.height}"
		class:pipette={pipetteActive}
		onclick={pickColor}
		onmousemove={trackHover}
		onmouseleave={clearHover}
	></canvas>
	<p class="dims">{image.width} × {image.height} px</p>
	{#if pipetteActive && hover && image}
		<PipetteLoupe
			{image}
			px={hover.px}
			py={hover.py}
			hex={hover.hex}
			clientX={hover.clientX}
			clientY={hover.clientY}
		/>
	{/if}
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
