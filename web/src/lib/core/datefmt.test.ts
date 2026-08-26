import { describe, expect, it } from 'vitest';
import { formatStamp } from './datefmt';

const d = new Date(2026, 7, 25, 9, 5, 3);

describe('formatStamp', () => {
	it('разворачивает все базовые токены', () => {
		expect(formatStamp(d, 'YYYY-MM-DD hh:mm:ss')).toBe('2026-08-25 09:05:03');
	});

	it('произвольный текст между токенами сохраняется', () => {
		expect(formatStamp(d, 'DD.MM.YYYY')).toBe('25.08.2026');
		expect(formatStamp(d, 'YYYY год, MM месяц')).toBe('2026 год, 08 месяц');
	});

	it('неизвестные последовательности не трогаются', () => {
		expect(formatStamp(d, 'YYYYYY MMМ')).toBe('2026YY 08М');
	});
});
