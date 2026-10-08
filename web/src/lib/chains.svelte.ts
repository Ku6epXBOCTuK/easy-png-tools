import { formatStamp } from "./core/datefmt";
import type { OutputMime } from "./core/io";
import type { PixelImage } from "./core/types";
import { t } from "./i18n/t";
import {
	CHAIN_VERSION,
	parseChain,
	serializeSteps,
	type ChainStep,
} from "./pipeline.svelte";

export interface NamedChain {
	id: string;
	name: string;
	updatedAt: number;
	steps: ChainStep[];
}

const STORE_KEY = "chains:named";

function storage(): Storage | null {
	return typeof localStorage === "undefined" ? null : localStorage;
}

export function autoChainName(date = new Date()): string {
	return t("savedChains.autoName", {
		stamp: formatStamp(date, "YYYY-MM-DD hh:mm"),
	});
}

/**
 * Lenient per entry: one broken chain must not kill the rest of the list.
 * Steps reuse the same serialized shape and validation as parseChain.
 */
export function parseNamedChains(data: unknown): NamedChain[] {
	if (
		!data ||
		typeof data !== "object" ||
		(data as { version?: unknown }).version !== CHAIN_VERSION ||
		!Array.isArray((data as { chains?: unknown }).chains)
	) {
		return [];
	}
	const out: NamedChain[] = [];
	for (const raw of (data as { chains: unknown[] }).chains) {
		if (!raw || typeof raw !== "object") continue;
		const { id, name, updatedAt, steps } = raw as {
			id?: unknown;
			name?: unknown;
			updatedAt?: unknown;
			steps?: unknown;
		};
		if (typeof id !== "string" || typeof name !== "string") continue;
		const parsed = parseChain({ version: CHAIN_VERSION, steps });
		if (!parsed) continue;
		out.push({
			id,
			name,
			updatedAt:
				typeof updatedAt === "number" && Number.isFinite(updatedAt)
					? updatedAt
					: 0,
			steps: parsed,
		});
	}
	return out;
}

export function serializeNamedChains(
	chains: NamedChain[],
): Record<string, unknown> {
	return {
		version: CHAIN_VERSION,
		chains: chains.map((c) => ({
			id: c.id,
			name: c.name,
			updatedAt: c.updatedAt,
			steps: serializeSteps(c.steps),
		})),
	};
}

function readAll(): NamedChain[] {
	const raw = storage()?.getItem(STORE_KEY);
	if (!raw) return [];
	try {
		return parseNamedChains(JSON.parse(raw));
	} catch {
		return [];
	}
}

function writeAll(chains: NamedChain[]): void {
	storage()?.setItem(STORE_KEY, JSON.stringify(serializeNamedChains(chains)));
}

/** Newest first. */
export function listChains(): NamedChain[] {
	return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getChain(id: string): NamedChain | undefined {
	return readAll().find((c) => c.id === id);
}

export function createNamedChain(name: string, steps: ChainStep[]): NamedChain {
	const chain: NamedChain = {
		id: crypto.randomUUID(),
		name: name.trim() || autoChainName(),
		updatedAt: Date.now(),
		steps,
	};
	writeAll([...readAll(), chain]);
	return chain;
}

export function updateChainSteps(id: string, steps: ChainStep[]): void {
	writeAll(
		readAll().map((c) =>
			c.id === id ? { ...c, steps, updatedAt: Date.now() } : c,
		),
	);
}

export function renameChain(id: string, name: string): void {
	const trimmed = name.trim();
	if (!trimmed) return;
	writeAll(readAll().map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
}

export function deleteChain(id: string): void {
	writeAll(readAll().filter((c) => c.id !== id));
}

/** State that cannot persist across the tool -> pipeline route swap. */
export interface ChainHandoff {
	source: PixelImage | null;
	textSource: string;
	format: OutputMime;
	limitKb: number | undefined;
}

const handoffs = new Map<string, ChainHandoff>();

export function stashHandoff(id: string, handoff: ChainHandoff): void {
	handoffs.set(id, handoff);
}

export function takeHandoff(id: string): ChainHandoff | undefined {
	const handoff = handoffs.get(id);
	handoffs.delete(id);
	return handoff;
}
