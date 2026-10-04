import { getTool, PAGES, type Page } from "./registry";
import { defaultSchemaParams, sanitizeSchemaParams } from "./registry-schema";

export interface ChainStep {
	/** Стабильный ключ для keyed each и drag-n-drop (переживает reorder). */
	key: string;
	id: string;
	params: Record<string, unknown>;
}

export const CHAIN_VERSION = 1;

function uid(): string {
	return crypto.randomUUID();
}

function storageKey(slug: string): string {
	return `pipeline:${slug}`;
}

function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

/** Инструмент можно вставить в середину цепочки: принимает и отдаёт картинку. */
export function isChainable(toolId: string): boolean {
	const tool = getTool(toolId);
	return (
		tool !== undefined &&
		tool.input === "image" &&
		(tool.result ?? "image") === "image"
	);
}

/** Страницы, чьи инструменты можно добавлять шагами (для picker'а). */
export function chainablePages(): Page[] {
	return PAGES.filter((p) => isChainable(p.steps[0].id));
}

export function createStep(id: string): ChainStep | null {
	const tool = getTool(id);
	if (!tool) return null;
	return { key: uid(), id, params: defaultSchemaParams(tool.schema) };
}

export function createChain(page: Page): ChainStep[] {
	const steps: ChainStep[] = [];
	for (const s of page.steps) {
		const tool = getTool(s.id);
		if (!tool) continue;
		steps.push({
			key: uid(),
			id: s.id,
			params: sanitizeSchemaParams(tool.schema, s.params ?? {}),
		});
	}
	return steps;
}

/** Валидация сохранённой цепочки; невалидные данные → null (дефолт страницы). */
export function parseChain(data: unknown): ChainStep[] | null {
	if (
		!data ||
		typeof data !== "object" ||
		(data as { version?: unknown }).version !== CHAIN_VERSION ||
		!Array.isArray((data as { steps?: unknown }).steps)
	) {
		return null;
	}
	const out: ChainStep[] = [];
	for (const raw of (data as { steps: unknown[] }).steps) {
		if (!raw || typeof raw !== "object") return null;
		const { id, params } = raw as { id?: unknown; params?: unknown };
		if (typeof id !== "string") return null;
		const tool = getTool(id);
		if (!tool) return null;
		out.push({
			key: uid(),
			id,
			params: sanitizeSchemaParams(
				tool.schema,
				(params ?? {}) as Record<string, unknown>,
			),
		});
	}
	return out.length > 0 ? out : null;
}

export function loadChain(slug: string): ChainStep[] | null {
	const raw = storage()?.getItem(storageKey(slug));
	if (!raw) return null;
	try {
		return parseChain(JSON.parse(raw));
	} catch {
		return null;
	}
}

export function saveChain(slug: string, steps: ChainStep[]): void {
	storage()?.setItem(
		storageKey(slug),
		JSON.stringify({
			version: CHAIN_VERSION,
			steps: steps.map((s) => ({ id: s.id, params: s.params })),
		}),
	);
}

export function insertStep(
	steps: ChainStep[],
	index: number,
	id: string,
): ChainStep[] {
	const step = createStep(id);
	if (!step) return steps;
	return [...steps.slice(0, index), step, ...steps.slice(index)];
}

export function removeStep(steps: ChainStep[], key: string): ChainStep[] {
	if (steps.length <= 1) return steps;
	return steps.filter((s) => s.key !== key);
}

export function moveStep(
	steps: ChainStep[],
	from: number,
	to: number,
): ChainStep[] {
	if (
		from === to ||
		from < 0 ||
		to < 0 ||
		from >= steps.length ||
		to >= steps.length
	) {
		return steps;
	}
	const next = [...steps];
	const [moved] = next.splice(from, 1);
	next.splice(to, 0, moved);
	return next;
}
