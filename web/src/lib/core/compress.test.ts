import { describe, expect, it } from 'vitest';
import { COMPRESSION_LEVELS, findMaxColorsWithin } from './compress';

describe('COMPRESSION_LEVELS', () => {
	it('пресеты упорядочены по убыванию цветов', () => {
		const values = Object.values(COMPRESSION_LEVELS);
		for (let i = 1; i < values.length; i++) expect(values[i - 1]).toBeGreaterThan(values[i]);
	});
});

describe('findMaxColorsWithin', () => {
	const sizeOf = (k: number) => 1000 + k * 100; // размер растёт с k

	it('подбирает максимум k, укладывающийся в цель', async () => {
		// target 5200 → подходит k≤42 → ожидаем 42 при maxK≥42
		const k = await findMaxColorsWithin(5200, 256, async (kk) => sizeOf(kk));
		expect(k).toBeGreaterThanOrEqual(40);
		expect(sizeOf(k)).toBeLessThanOrEqual(5200);
	});

	it('цель достигается даже на минимуме — возвращает 2', async () => {
		const k = await findMaxColorsWithin(50, 256, async (kk) => sizeOf(kk));
		expect(k).toBe(2);
	});

	it('encodeSize null трактуется как провал', async () => {
		const k = await findMaxColorsWithin(999999, 16, async () => null);
		expect(k).toBe(2);
	});

	it('бинарный поиск сходится быстрее полного перебора', async () => {
		let calls = 0;
		await findMaxColorsWithin(30000, 256, async (kk) => {
			calls++;
			return sizeOf(kk);
		});
		expect(calls).toBeLessThanOrEqual(12); // log2(254)+probe(2)
	});
});
