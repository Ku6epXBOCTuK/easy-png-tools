<script lang="ts">
	import type { PixelImage } from "$lib/core/types";

	interface Props {
		image: PixelImage;
		px: number;
		py: number;
		hex: string;
		clientX: number;
		clientY: number;
	}

	let { image, px, py, hex, clientX, clientY }: Props = $props();

	const SIZE = 110;
	const ZOOM = 8;
	const BLOCK = 15;
	const HALF = Math.floor(BLOCK / 2);
	const CENTER = SIZE / 2;

	let loupeCanvas = $state<HTMLCanvasElement | undefined>();

	let srcCanvas: HTMLCanvasElement | null = null;
	let srcKey: PixelImage | null = null;

	function ensureSource(): HTMLCanvasElement | null {
		if (!srcCanvas || srcKey !== image) {
			srcCanvas = document.createElement("canvas");
			srcCanvas.width = image.width;
			srcCanvas.height = image.height;
			srcCanvas
				.getContext("2d")
				?.putImageData(
					new ImageData(image.data, image.width, image.height),
					0,
					0,
				);
			srcKey = image;
		}
		return srcCanvas;
	}

	function clamp(v: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, v));
	}

	const blockX = $derived(
		clamp(px - HALF, 0, Math.max(0, image.width - BLOCK)),
	);
	const blockY = $derived(
		clamp(py - HALF, 0, Math.max(0, image.height - BLOCK)),
	);
	const flipBelow = $derived(clientY < SIZE + 24);

	$effect(() => {
		if (!loupeCanvas) return;
		const dpr = window.devicePixelRatio || 1;
		loupeCanvas.width = SIZE * dpr;
		loupeCanvas.height = SIZE * dpr;
		const ctx = loupeCanvas.getContext("2d");
		const src = ensureSource();
		if (!ctx || !src) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.imageSmoothingEnabled = false;
		ctx.fillStyle = "#111318";
		ctx.fillRect(0, 0, SIZE, SIZE);
		ctx.drawImage(
			src,
			blockX,
			blockY,
			BLOCK,
			BLOCK,
			CENTER + (blockX - px) * ZOOM,
			CENTER + (blockY - py) * ZOOM,
			BLOCK * ZOOM,
			BLOCK * ZOOM,
		);
		ctx.strokeStyle = "rgba(255,255,255,0.9)";
		ctx.lineWidth = 1;
		ctx.strokeRect(
			CENTER - ZOOM / 2 + 0.5,
			CENTER - ZOOM / 2 + 0.5,
			ZOOM,
			ZOOM,
		);
	});
</script>

<div
	class="loupe"
	class:flip={flipBelow}
	style="left:{clientX}px;top:{clientY}px"
	aria-hidden="true"
>
	<canvas bind:this={loupeCanvas} style="width:{SIZE}px;height:{SIZE}px"
	></canvas>
	<p class="hex">{hex}</p>
</div>

<style>
	.loupe {
		position: fixed;
		z-index: 50;
		transform: translate(-50%, calc(-100% - 16px));
		padding: 4px 4px 2px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
		box-shadow: var(--shadow-card);
		pointer-events: none;
	}

	.loupe.flip {
		transform: translate(-50%, 16px);
	}

	canvas {
		display: block;
		border-radius: var(--radius-s);
	}

	.hex {
		margin: 2px 0 0;
		text-align: center;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-muted);
	}
</style>
