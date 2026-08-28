import { clonePixelImage, createPixelImage, type PixelImage } from "./types";

export function vignette(img: PixelImage, strengthPercent: number): PixelImage {
	const strength = Math.min(Math.max(strengthPercent, 0), 100) / 100;
	if (strength === 0) return clonePixelImage(img);
	const cx = (img.width - 1) / 2;
	const cy = (img.height - 1) / 2;
	const maxDist = Math.sqrt(cx * cx + cy * cy);
	const out = createPixelImage(img.width, img.height);
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const dx = x - cx;
			const dy = y - cy;
			const t = Math.sqrt(dx * dx + dy * dy) / maxDist;
			const factor = 1 - strength * t * t;
			const di = (y * img.width + x) * 4;
			out.data[di] = img.data[di] * factor;
			out.data[di + 1] = img.data[di + 1] * factor;
			out.data[di + 2] = img.data[di + 2] * factor;
			out.data[di + 3] = img.data[di + 3];
		}
	}
	return out;
}
