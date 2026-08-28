/**
 * Нормализация строки для поиска: нижний регистр, ё→е, снятие диакритики (NFD).
 */
export function normalizeForSearch(value: string): string {
	return value
		.toLowerCase()
		.replaceAll("ё", "е")
		.normalize("NFD")
		.replace(/\p{M}/gu, "");
}

export type SearchDoc = {
	id: string;
	titles: string[];
	descriptions: string[];
};

const SUBSEQUENCE_BASE = 20;

function bestTitleScore(titles: string[], q: string): number | null {
	let best: number | null = null;
	for (const raw of titles) {
		const title = normalizeForSearch(raw);
		if (title.startsWith(q)) return 100;
		const at = title.indexOf(q);
		if (at >= 0) {
			const s = 80 - Math.min(at, 40);
			if (best === null || s > best) best = s;
			continue;
		}
		let pos = 0;
		let sub = SUBSEQUENCE_BASE;
		for (const ch of q) {
			pos = title.indexOf(ch, pos);
			if (pos < 0) {
				sub = -1;
				break;
			}
			sub -= 1;
			pos += 1;
		}
		if (sub >= 0 && (best === null || sub > best)) best = sub;
	}
	return best;
}

/**
 * Скоринг документа против нормализованного запроса.
 * Пустой запрос — нейтральный балл; отсутствие совпадения — null.
 */
export function scoreDoc(
	doc: SearchDoc,
	normalizedQuery: string,
): number | null {
	if (normalizedQuery.length === 0) return 1;
	if (normalizeForSearch(doc.id).includes(normalizedQuery)) {
		const at = normalizeForSearch(doc.id).indexOf(normalizedQuery);
		const byId = 60 - Math.min(at, 40);
		const byTitle = bestTitleScore(doc.titles, normalizedQuery);
		if (byTitle !== null && byTitle >= 80) return byTitle;
		return Math.max(byId, byTitle ?? -1);
	}
	const byTitle = bestTitleScore(doc.titles, normalizedQuery);
	if (byTitle !== null && byTitle >= 20) return byTitle;
	for (const raw of doc.descriptions) {
		if (normalizeForSearch(raw).includes(normalizedQuery)) return 30;
	}
	return byTitle !== null && byTitle > 0 ? byTitle : null;
}
