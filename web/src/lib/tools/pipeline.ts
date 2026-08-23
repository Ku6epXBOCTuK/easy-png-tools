import { getTool, sanitizeParams } from '../registry';

export type PipelineStep = {
	id: string;
	toolId: string;
	values: Record<string, unknown>;
};

export type PipelineDocument = { version: number; steps: PipelineStep[] };

export const PIPELINE_VERSION = 1;
const STORAGE_KEY = 'workspace-pipeline';

export function createStep(toolId: string): PipelineStep {
	const tool = getTool(toolId);
	if (!tool) {
		throw new Error(`Инструмент "${toolId}" не найден`);
	}
	return { id: newStepId(), toolId, values: {} };
}

export function newStepId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return `step-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function parseDocument(raw: string): PipelineStep[] {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error('Файл не является корректным JSON');
	}
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new Error('Структура файла не похожа на цепочку шагов');
	}
	const doc = parsed as { version?: unknown; steps?: unknown };
	if (doc.version !== PIPELINE_VERSION) {
		throw new Error(`Неподдерживаемая версия цепочки: ${String(doc.version)}`);
	}
	if (!Array.isArray(doc.steps)) {
		throw new Error('В файле нет списка шагов');
	}
	const steps: PipelineStep[] = [];
	for (const rawStep of doc.steps) {
		const step = validateStep(rawStep);
		if (step) {
			steps.push(step);
		}
	}
	return steps;
}

function validateStep(raw: unknown): PipelineStep | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const candidate = raw as { id?: unknown; toolId?: unknown; values?: unknown };
	if (typeof candidate.toolId !== 'string') return null;
	const tool = getTool(candidate.toolId);
	if (!tool || typeof candidate.values !== 'object' || candidate.values === null) return null;
	const values = candidate.values as Record<string, unknown>;
	return {
		id: typeof candidate.id === 'string' && candidate.id.length > 0 ? candidate.id : newStepId(),
		toolId: candidate.toolId,
		values: sanitizeParams(tool, values)
	};
}

export function saveSteps(steps: PipelineStep[]): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: PIPELINE_VERSION, steps })
		);
	} catch {
		// переполнение квоты или приватный режим — сохранение необязательно для работы
	}
}

export function loadStoredSteps(): PipelineStep[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return parseDocument(raw);
	} catch {
		return [];
	}
}
