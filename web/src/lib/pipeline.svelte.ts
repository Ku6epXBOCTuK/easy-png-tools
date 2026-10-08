import { getTool, PAGES, type Page } from "./registry";
import { defaultSchemaParams, sanitizeSchemaParams } from "./registry-schema";

export interface ChainStep {
	key: string;
	id: string;
	params: Record<string, unknown>;
	collapsed?: boolean;
}

export const CHAIN_VERSION = 1;

function uid(): string {
	return crypto.randomUUID();
}

/** Tool can be inserted mid-chain: it accepts and returns an image. */
export function isChainable(toolId: string): boolean {
	const tool = getTool(toolId);
	return (
		tool !== undefined &&
		tool.input === "image" &&
		(tool.result ?? "image") === "image"
	);
}

/** Pages whose tools can be added as steps (for the picker). */
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

/** Validates a saved chain; invalid data -> null (page default). */
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
			collapsed:
				(raw as { collapsed?: unknown }).collapsed === true ? true : undefined,
			params: sanitizeSchemaParams(
				tool.schema,
				(params ?? {}) as Record<string, unknown>,
			),
		});
	}
	return out.length > 0 ? out : null;
}

/** Serialized step shape shared by per-slug chains and named chains. */
export function serializeSteps(steps: ChainStep[]): Record<string, unknown>[] {
	return steps.map((s) => ({
		id: s.id,
		params: s.params,
		...(s.collapsed ? { collapsed: true } : {}),
	}));
}

/** True while steps match the page definition identity-wise (params ignored). */
export function isStructuralDefault(page: Page, steps: ChainStep[]): boolean {
	return (
		steps.length === page.steps.length &&
		steps.every((s, i) => s.id === page.steps[i].id)
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
