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
 * Cuts a shape out of the image: source pixels kept inside, alpha zeroed
 * outside. Offset is a fraction of free space per axis: +-0.5 pins the shape
 * to the edge regardless of size. Free space derives from extent (half-size).
 */
export function renderShape(
	img: PixelImage,
	test: ShapeTest,
	offsetXFrac = 0,
	offsetYFrac = 0,
	extent: ShapeExtent = { x: 0, y: 0 },
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const minDim = Math.min(img.width, img.height);
	const freeX = Math.max(0, img.width / (2 * minDim) - extent.x);
	const freeY = Math.max(0, img.height / (2 * minDim) - extent.y);
	const cx = img.width / 2 + offsetXFrac * 2 * freeX * minDim;
	const cy = img.height / 2 + offsetYFrac * 2 * freeY * minDim;
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
