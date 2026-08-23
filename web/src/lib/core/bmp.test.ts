import { describe, expect, it } from 'vitest';
import { encodeBmpBytes } from './bmp';
import { makeImage } from './test-helpers';

describe('encodeBmpBytes', () => {
	it('пишет заголовки BM и размеры для 2x1 без паддинга-неопределённости', () => {
		const bytes = encodeBmpBytes(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255]
			])
		);
		expect([bytes[0], bytes[1]]).toEqual([0x42, 0x4d]);
		const view = new DataView(bytes.buffer);
		expect(view.getUint32(2, true)).toBe(54 + 8);
		expect(view.getInt32(18, true)).toBe(2);
		expect(view.getInt32(22, true)).toBe(1);
		expect(view.getUint16(28, true)).toBe(24);
	});

	it('хранит пиксели в BGR снизу-вверх с паддингом строки', () => {
		const bytes = encodeBmpBytes(
			makeImage(2, 1, [
				[255, 0, 0, 255],
				[0, 255, 0, 255]
			])
		);
		expect([...bytes.slice(54, 60)]).toEqual([
			0, 0, 255,
			0, 255, 0
		]);
		expect(bytes[60]).toBe(0);
		expect(bytes[61]).toBe(0);
	});

	it('нижняя строка изображения идёт первой в файле', () => {
		const bytes = encodeBmpBytes(
			makeImage(4, 2, [
				[10, 10, 10, 255],
				[20, 20, 20, 255],
				[30, 30, 30, 255],
				[40, 40, 40, 255],
				[50, 50, 50, 255],
				[60, 60, 60, 255],
				[70, 70, 70, 255],
				[80, 80, 80, 255]
			])
		);
		expect(bytes[54]).toBe(50);
		expect(bytes[54 + 12]).toBe(10);
	});
});
