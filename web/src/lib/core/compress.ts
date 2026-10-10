import type { OutputMime } from "./io";
import { quantizeImage } from "./quantize";
import type { PixelImage } from "./types";

/** Compression presets: level -> number of quantization colors. */
export const COMPRESSION_LEVELS = {
	light: 192,
	balanced: 96,
	strong: 44,
	extreme: 16,
} as const;

export type CompressionLevel = keyof typeof COMPRESSION_LEVELS;

/**
 * Binary search for the largest k in [2..maxK] whose encoded size fits
 * targetBytes. If even k=2 does not fit, returns 2 (best effort).
 * encodeSize may return null (encode error), treated as "does not fit".
 */
export async function findMaxColorsWithin(
	targetBytes: number,
	maxK: number,
	encodeSize: (k: number) => Promise<number | null>,
): Promise<number> {
	const hi = Math.max(2, Math.round(maxK));
	let ok = 2;
	let fitsAtTwo = false;
	const probe = async (k: number): Promise<boolean> => {
		const size = await encodeSize(Math.max(2, Math.min(hi, k)));
		if (size === null) return false;
		if (size <= targetBytes) {
			ok = k;
			fitsAtTwo = fitsAtTwo || k === 2;
			return true;
		}
		return false;
	};

	if (!(await probe(2))) return 2;
	let lo = 2;
	let hiK = hi;
	while (hiK - lo > 1) {
		const mid = Math.floor((lo + hiK) / 2);
		if (await probe(mid)) lo = mid;
		else hiK = mid;
	}
	await probe(lo);
	void fitsAtTwo;
	return ok;
}

/**
 * Binary search for the highest quality percent in [min..max] whose encoded
 * size fits targetBytes. If even min does not fit, returns min (best effort).
 * encodeSize may return null (encode error), treated as "does not fit".
 */
export async function findQualityWithin(
	targetBytes: number,
	encodeSize: (quality: number) => Promise<number | null>,
	min = 1,
	max = 100,
): Promise<number> {
	const lo = Math.max(1, Math.round(min));
	const hi = Math.max(lo, Math.round(max));
	let ok = lo;
	const probe = async (q: number): Promise<boolean> => {
		const size = await encodeSize(Math.max(lo, Math.min(hi, q)));
		if (size === null) return false;
		if (size <= targetBytes) {
			ok = q;
			return true;
		}
		return false;
	};

	if (!(await probe(lo))) return lo;
	if (await probe(hi)) return hi;
	let a = lo;
	let b = hi;
	while (b - a > 1) {
		const mid = Math.floor((a + b) / 2);
		if (await probe(mid)) a = mid;
		else b = mid;
	}
	return ok;
}

export type EncodeFn = (
	img: PixelImage,
	mime: OutputMime,
	quality?: number,
) => Promise<Blob>;

/** Encodes img to fit targetBytes (quality search for lossy, color count for
 *  PNG; BMP as-is). `encodeFn` injected (core/io.encode): policy stays DOM-free. */
export async function fitWithinBytes(
	img: PixelImage,
	mime: OutputMime,
	targetBytes: number,
	quality: number | undefined,
	encodeFn: EncodeFn,
): Promise<Blob> {
	if (mime === "image/bmp") return encodeFn(img, mime);
	const initial = await encodeFn(img, mime, quality);
	if (initial.size <= targetBytes) return initial;
	if (mime === "image/png") {
		const encodeSize = async (k: number) =>
			(await encodeFn(quantizeImage(img, k).image, mime)).size;
		const k = await findMaxColorsWithin(targetBytes, 256, encodeSize);
		return encodeFn(quantizeImage(img, k).image, mime);
	}
	const encodeSize = async (q: number) =>
		(await encodeFn(img, mime, q / 100)).size;
	const q = await findQualityWithin(targetBytes, encodeSize);
	return encodeFn(img, mime, q / 100);
}
