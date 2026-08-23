import { describe, expect, it } from 'vitest';
import { createStep, parseDocument } from './pipeline';

describe('createStep', () => {
	it('создаёт шаг с дефолтными значениями инструмента', () => {
		const step = createStep('grayscale-png');
		expect(step.toolId).toBe('grayscale-png');
		expect(step.id.length).toBeGreaterThan(0);
	});

	it('бросает ошибку для неизвестного инструмента', () => {
		expect(() => createStep('no-such-tool')).toThrow(/не найден/);
	});
});

describe('parseDocument', () => {
	const valid = JSON.stringify({
		version: 1,
		steps: [
			{ id: 'a', toolId: 'grayscale-png', values: {} },
			{
				id: 'b',
				toolId: 'adjust-brightness-contrast-png',
				values: { brightness: 5000, contrast: 'мусор' }
			}
		]
	});

	it('разбирает корректный документ и санитизирует значения', () => {
		const steps = parseDocument(valid);
		expect(steps).toHaveLength(2);
		expect(steps[0].id).toBe('a');
		expect(steps[1].values).toEqual({ brightness: 100, contrast: 0 });
	});

	it.each(['не json', '{}', JSON.stringify({ version: 99, steps: [] }), JSON.stringify({ version: 1 })])(
		'отклоняет мусор: %s',
		(raw) => {
			expect(() => parseDocument(raw as string)).toThrow();
		}
	);

	it('пропускает шаги с неизвестным инструментом', () => {
		const raw = JSON.stringify({
			version: 1,
			steps: [
				{ id: 'x', toolId: 'nope', values: {} },
				{ id: 'y', toolId: 'flip-png', values: { axis: 'vertical' } }
			]
		});
		const steps = parseDocument(raw);
		expect(steps.map((s) => s.id)).toEqual(['y']);
	});
});
