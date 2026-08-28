import { parseHex } from "./alpha";
import { ToolError } from "./errors";
import { clonePixelImage, createPixelImage, type PixelImage } from "./types";
import { sampleBilinear } from "./geometry";

export type AffineMatrix = [number, number, number, number, number, number];

export function invertAffine([a, b, c, d, e, f]: AffineMatrix): AffineMatrix {
	const det = a * d - b * c;
	if (Math.abs(det) < 1e-12) {
		throw new ToolError("errors.badTransform");
	}
	const ia = d / det;
	const ib = -b / det;
	const ic = -c / det;
	const id = a / det;
	return [ia, ib, ic, id, -(ia * e + ic * f), -(ib * e + id * f)];
}

const EPS = 1e-9;

export function transformImage(
	img: PixelImage,
	dstToSrc: AffineMatrix,
	outWidth: number,
	outHeight: number,
	bgHex?: string,
): PixelImage {
	const [a, b, c, d, e, f] = dstToSrc;
	const out = createPixelImage(outWidth, outHeight);
	const bg = bgHex ? parseHex(bgHex) : null;
	for (let y = 0; y < outHeight; y++) {
		for (let x = 0; x < outWidth; x++) {
			const sx = a * x + c * y + e;
			const sy = b * x + d * y + f;
			const di = (y * outWidth + x) * 4;
			if (
				sx < -EPS ||
				sy < -EPS ||
				sx > img.width - 1 + EPS ||
				sy > img.height - 1 + EPS
			) {
				if (bg) {
					out.data[di] = bg[0];
					out.data[di + 1] = bg[1];
					out.data[di + 2] = bg[2];
					out.data[di + 3] = 255;
				}
				continue;
			}
			const [r, g, bl, al] = sampleBilinear(img, sx, sy);
			if (bg) {
				const sa = al / 255;
				out.data[di] = r * sa + bg[0] * (1 - sa);
				out.data[di + 1] = g * sa + bg[1] * (1 - sa);
				out.data[di + 2] = bl * sa + bg[2] * (1 - sa);
				out.data[di + 3] = 255;
			} else {
				out.data[di] = r;
				out.data[di + 1] = g;
				out.data[di + 2] = bl;
				out.data[di + 3] = al;
			}
		}
	}
	return out;
}

function centeredTransform(img: PixelImage, forward: AffineMatrix): PixelImage {
	const inv = invertAffine(forward);

	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const [px, py] of [
		[0.5, 0.5],
		[img.width - 0.5, 0.5],
		[0.5, img.height - 0.5],
		[img.width - 0.5, img.height - 0.5],
	]) {
		const qx = forward[0] * px + forward[2] * py + forward[4];
		const qy = forward[1] * px + forward[3] * py + forward[5];
		minX = Math.min(minX, qx);
		maxX = Math.max(maxX, qx);
		minY = Math.min(minY, qy);
		maxY = Math.max(maxY, qy);
	}
	const outW = Math.round(maxX - minX) + 1;
	const outH = Math.round(maxY - minY) + 1;
	const tx = inv[0] * minX + inv[2] * minY - 0.5;
	const ty = inv[1] * minX + inv[3] * minY - 0.5;
	return transformImage(
		img,
		[inv[0], inv[1], inv[2], inv[3], tx, ty],
		outW,
		outH,
	);
}

export function skewImage(
	img: PixelImage,
	degX: number,
	degY: number,
): PixelImage {
	const kx = Math.tan((degX * Math.PI) / 180);
	const ky = Math.tan((degY * Math.PI) / 180);
	if (!Number.isFinite(kx) || !Number.isFinite(ky)) {
		throw new ToolError("errors.skewAngle");
	}
	return centeredTransform(img, [1, ky, kx, 1, 0, 0]);
}

export function rotateFreeImage(img: PixelImage, degrees: number): PixelImage {
	const rad = (degrees * Math.PI) / 180;
	let cos = Math.cos(rad);
	let sin = Math.sin(rad);
	if (Math.abs(sin) < 1e-12) sin = 0;
	if (Math.abs(cos) < 1e-12) cos = 0;
	return centeredTransform(img, [cos, sin, -sin, cos, 0, 0]);
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
