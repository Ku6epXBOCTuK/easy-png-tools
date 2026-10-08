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
