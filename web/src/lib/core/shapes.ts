import type { PixelImage } from "./types";
import { createPixelImage } from "./types";

export type ShapeTest = (nx: number, ny: number) => boolean;

/** Half-size of the shape in normalized test coordinates, per axis. */
export interface ShapeExtent {
	x: number;
	y: number;
}

/**
 * Test coordinates: normalized to half of the image's smaller side,
 * center at (0,0), Y axis pointing down as in pixels.
 */

export function circleTest(radiusFrac: number): ShapeTest {
	return (nx, ny) => Math.hypot(nx, ny) <= radiusFrac;
}

export function boxTest(halfWFrac: number, halfHFrac: number): ShapeTest {
	return (nx, ny) => Math.abs(nx) <= halfWFrac && Math.abs(ny) <= halfHFrac;
}

/** Star with `points` rays; innerFrac is the valley radius as a fraction of the outer radius. */
export function starTest(
	points: number,
	innerFrac: number,
	outerFrac: number,
	rotationDeg: number,
): ShapeTest {
	const n = Math.max(3, Math.round(points));
	const rot = (rotationDeg * Math.PI) / 180;
	return (nx, ny) => {
		const theta = Math.atan2(ny, nx) - rot;
		const r = Math.hypot(nx, ny);
		if (r > outerFrac) return false;
		const t = ((theta * n) / (2 * Math.PI)) % 1;
		const tri = Math.abs(t - Math.floor(t + 0.5)) * 2; // 0 on a ray, 1 in a valley
		const edge = outerFrac - (outerFrac - innerFrac) * tri;
		return r <= edge;
	};
}

/** Wavy circle: radius modulated by a sine of frequency `waves`. */
export function wavyTest(
	baseFrac: number,
	amplitudeFrac: number,
	waves: number,
	phaseDeg: number,
): ShapeTest {
	const phase = (phaseDeg * Math.PI) / 180;
	return (nx, ny) => {
		const theta = Math.atan2(ny, nx);
		const r = Math.hypot(nx, ny);
		const edge = baseFrac + amplitudeFrac * Math.sin(waves * theta + phase);
		return r <= edge;
	};
}

/**
 * Shared geometry: shape center in pixels from offset fractions and extent.
 * Offset is a fraction of free space per axis: +-0.5 pins the shape to the
 * edge regardless of size. Free space derives from extent (half-size).
 */
function shapeOrigin(
	width: number,
	height: number,
	offsetXFrac: number,
	offsetYFrac: number,
	extent: ShapeExtent,
): { cx: number; cy: number; minDim: number } {
	const minDim = Math.min(width, height);
	const freeX = Math.max(0, width / (2 * minDim) - extent.x);
	const freeY = Math.max(0, height / (2 * minDim) - extent.y);
	return {
		cx: width / 2 + offsetXFrac * 2 * freeX * minDim,
		cy: height / 2 + offsetYFrac * 2 * freeY * minDim,
		minDim,
	};
}

/**
 * Cuts a shape out of the image: source pixels kept inside, alpha zeroed
 * outside.
 */
export function renderShape(
	img: PixelImage,
	test: ShapeTest,
	offsetXFrac = 0,
	offsetYFrac = 0,
	extent: ShapeExtent = { x: 0, y: 0 },
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const { cx, cy, minDim } = shapeOrigin(
		img.width,
		img.height,
		offsetXFrac,
		offsetYFrac,
		extent,
	);
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const di = (y * img.width + x) * 4;
			if (!test((x + 0.5 - cx) / minDim, (y + 0.5 - cy) / minDim)) continue;
			out.data[di] = img.data[di];
			out.data[di + 1] = img.data[di + 1];
			out.data[di + 2] = img.data[di + 2];
			out.data[di + 3] = img.data[di + 3];
		}
	}
	return out;
}

/** B/w preview of the shape itself: white inside, black outside. */
export function renderShapeMask(
	width: number,
	height: number,
	test: ShapeTest,
	offsetXFrac = 0,
	offsetYFrac = 0,
	extent: ShapeExtent = { x: 0, y: 0 },
): PixelImage {
	const out = createPixelImage(width, height);
	const { cx, cy, minDim } = shapeOrigin(
		width,
		height,
		offsetXFrac,
		offsetYFrac,
		extent,
	);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const di = (y * width + x) * 4;
			const inside = test((x + 0.5 - cx) / minDim, (y + 0.5 - cy) / minDim);
			const v = inside ? 255 : 0;
			out.data[di] = v;
			out.data[di + 1] = v;
			out.data[di + 2] = v;
			out.data[di + 3] = 255;
		}
	}
	return out;
}
