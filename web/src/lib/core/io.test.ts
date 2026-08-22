import { describe, expect, it } from 'vitest';
import { isSupportedImage, unsupportedImageMessage } from './io';

describe('isSupportedImage', () => {
	it.each(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/x-icon'])(
		'принимает %s',
		(type) => {
			expect(isSupportedImage(new File([], 'x', { type }))).toBe(true);
		}
	);

	it('отклоняет неподдерживаемый тип', () => {
		expect(isSupportedImage(new File([], 'a.txt', { type: 'text/plain' }))).toBe(false);
	});

	it('отклоняет файл без типа', () => {
		expect(isSupportedImage(new File([], 'x'))).toBe(false);
	});
});

describe('unsupportedImageMessage', () => {
	it('упоминает тип файла и поддерживаемые форматы', () => {
		const message = unsupportedImageMessage(new File([], 'a.txt', { type: 'text/plain' }));
		expect(message).toContain('text/plain');
		expect(message).toContain('PNG');
	});

	it('сообщает про неизвестный тип, когда он пуст', () => {
		expect(unsupportedImageMessage(new File([], 'x'))).toContain('неизвестный');
	});
});
