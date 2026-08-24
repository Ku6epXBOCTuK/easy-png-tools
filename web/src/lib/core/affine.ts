import { clonePixelImage, createPixelImage, type PixelImage } from './types';
import { sampleBilinear } from './geometry';

export type AffineMatrix = [number, number, number, number, number, number];

export function invertAffine([a, b, c, d, e, f]: AffineMatrix): AffineMatrix {
	const det = a * d - b * c;
	if (Math.abs(det) < 1e-12) {
		throw new Error('Вырожденная матрица трансформации');
	}
	const ia = d / det;
	const ib = -b / det;
	const ic = -c / det;
	const id = a / det;
	return [ia, ib, ic, id, -(ia * e + ic * f), -(ib * e + id * f)];
}

function mulAffine(m1: AffineMatrix, m2: AffineMatrix): AffineMatrix {
	return [
		m1[0] * m2[0] + m1[2] * m2[1],
		m1[1] * m2[0] + m1[3] * m2[1],
		m1[0] * m2[2] + m1[2] * m2[3],
		m1[1] * m2[2] + m1[3] * m2[3],
		m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
		m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
	];
}

export function transformImage(
	img: PixelImage,
	dstToSrc: AffineMatrix,
	outWidth: number,
	outHeight: number
): PixelImage {
	const [a, b, c, d, e, f] = invertAffine(dstToSrc);
	const out = createPixelImage(outWidth, outHeight);
	for (let y = 0; y < outHeight; y++) {
		for (let x = 0; x < outWidth; x++) {
			const sx = a * x + c * y + e;
			const sy = b * x + d * y + f;
			const di = (y * outWidth + x) * 4;
			if (sx < -1 || sy < -1 || sx > img.width || sy > img.height) continue;
			const [r, g, bl, al] = sampleBilinear(img, sx, sy);
			out.data[di] = r;
			out.data[di + 1] = g;
			out.data[di + 2] = bl;
			out.data[di + 3] = al;
		}
	}
	return out;
}

function transformCorners(
	img: PixelImage,
	m: AffineMatrix
): { minX: number; minY: number; outW: number; outH: number } {
	const pts = [
		[0, 0],
		[img.width, 0],
		[0, img.height],
		[img.width, img.height]
	].map(([x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]);
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const minX = Math.min(...xs);
	const minY = Math.min(...ys);
	return {
		minX,
		minY,
		outW: Math.ceil(Math.max(...xs) - minX),
		outH: Math.ceil(Math.max(...ys) - minY)
	};
}

export function skewImage(img: PixelImage, degX: number, degY: number): PixelImage {
	const kx = Math.tan((degX * Math.PI) / 180);
	const ky = Math.tan((degY * Math.PI) / 180);
	if (!Number.isFinite(kx) || !Number.isFinite(ky)) {
		throw new Error('Углы наклона не могут быть 90° или -90°');
	}
	const forward: AffineMatrix = [1, ky, kx, 1, 0, 0];
	const bounds = transformCorners(img, forward);
	const toOrigin: AffineMatrix = [1, 0, 0, 1, -bounds.minX, -bounds.minY];
	return transformImage(img, mulAffine(invertAffine(forward), invertAffine(toOrigin)), bounds.outW, bounds.outH);
}

export function rotateFreeImage(img: PixelImage, degrees: number): PixelImage {
	const rad = (degrees * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const forward: AffineMatrix = [cos, sin, -sin, cos, 0, 0];
	const bounds = transformCorners(img, forward);
	const toOrigin: AffineMatrix = [1, 0, 0, 1, -bounds.minX, -bounds.minY];
	return transformImage(
		img,
		mulAffine(invertAffine(forward), invertAffine(toOrigin)),
		bounds.outW,
		bounds.outH
	);
}

export function zoomImage(img: PixelImage, scalePercent: number): PixelImage {
	const scale = Math.min(Math.max(scalePercent, 100), 1000) / 100;
	if (scale === 1) return clonePixelImage(img);
	const cx = (img.width - 1) / 2;
	const cy = (img.height - 1) / 2;
	const out = createPixelImage(img.width, img.height);
	for (let y = 0; y < out.height; y++) {
		for (let x = 0; x < out.width; x++) {
			const sx = cx + (x - cx) / scale;
			const sy = cy + (y - cy) / scale;
			const [r, g, b, a] = sampleBilinear(img, sx, sy);
			const di = (y * out.width + x) * 4;
			out.data[di] = r;
			out.data[di + 1] = g;
			out.data[di + 2] = b;
			out.data[di + 3] = a;
		}
	}
	return out;
}
