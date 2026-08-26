/** Пресеты сжатия: уровень → число цветов квантования. */
export const COMPRESSION_LEVELS = {
	light: 192,
	balanced: 96,
	strong: 44,
	extreme: 16
} as const;

export type CompressionLevel = keyof typeof COMPRESSION_LEVELS;

/**
 * Бинарный поиск наибольшего k ∈ [2..maxK], при котором закодированный размер
 * укладывается в targetBytes. Если даже k=2 не влезает — возвращается 2 (best effort).
 * encodeSize может вернуть null (ошибка кодирования) — трактуется как «не влезло».
 */
export async function findMaxColorsWithin(
	targetBytes: number,
	maxK: number,
	encodeSize: (k: number) => Promise<number | null>
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
