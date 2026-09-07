import { ToolError } from "./errors";
import type { PixelImage } from "./types";
import { createPixelImage } from "./types";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Строки вида «r g b a» по одной строке на ряд пикселей. */
export function imageToByteRows(img: PixelImage): string {
	const rows: string[] = [];
	for (let y = 0; y < img.height; y++) {
		const parts: string[] = [];
		for (let x = 0; x < img.width; x++) {
			const i = (y * img.width + x) * 4;
			parts.push(
				`${img.data[i]} ${img.data[i + 1]} ${img.data[i + 2]} ${img.data[i + 3]}`,
			);
		}
		rows.push(parts.join("  "));
	}
	return rows.join("\n");
}

export function bytesToImage(text: string, width: number): PixelImage {
	const nums = (text.match(/-?\d+/g) ?? []).map(Number);
	if (nums.length % 4 !== 0) {
		throw new ToolError("errors.bytesCount", { count: nums.length });
	}
	if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
		throw new ToolError("errors.byteRange");
	}
	const w = Math.trunc(width);
	if (!Number.isInteger(w) || w < 1) throw new ToolError("errors.widthInt");
	if ((nums.length / 4) % w !== 0) {
		throw new ToolError("errors.pixelCountMismatch", {
			count: nums.length / 4,
			width: w,
		});
	}
	const out = createPixelImage(w, nums.length / 4 / w);
	out.data.set(nums);
	return out;
}

/** Строки вида «rgba(r, g, b, a)», по одной на пиксель, ряды через перевод строки. */
export function imageToRgbValues(img: PixelImage): string {
	const rows: string[] = [];
	for (let y = 0; y < img.height; y++) {
		const parts: string[] = [];
		for (let x = 0; x < img.width; x++) {
			const i = (y * img.width + x) * 4;
			parts.push(
				`rgba(${img.data[i]}, ${img.data[i + 1]}, ${img.data[i + 2]}, ${img.data[i + 3]})`,
			);
		}
		rows.push(parts.join("  "));
	}
	return rows.join("\n");
}

export function rgbValuesToImage(text: string, width: number): PixelImage {
	const nums = (text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
	if (nums.length % 4 !== 0) {
		throw new ToolError("errors.bytesCount", { count: nums.length });
	}
	if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
		throw new ToolError("errors.byteRange");
	}
	const w = Math.trunc(width);
	if (!Number.isInteger(w) || w < 1) throw new ToolError("errors.widthInt");
	const pxCount = nums.length / 4;
	if (pxCount % w !== 0) {
		throw new ToolError("errors.pixelCountMismatch", {
			count: pxCount,
			width: w,
		});
	}
	const out = createPixelImage(w, pxCount / w);
	out.data.set(nums);
	return out;
}

/** Снимает префикс data-uri (data:image/...;base64,) при наличии. */
export function stripDataUri(text: string): string {
	const m = /^\s*data:[^,\s]*base64,/i.exec(text);
	return m ? text.slice(m[0].length) : text.trim();
}

export function base64ToBytes(text: string): Uint8Array<ArrayBuffer> {
	const clean = text.replace(/\s+/g, "");
	const binary = atob(clean);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export function looksLikePng(bytes: Uint8Array): boolean {
	if (bytes.length < PNG_SIGNATURE.length) return false;
	return PNG_SIGNATURE.every((v, i) => bytes[i] === v);
}
