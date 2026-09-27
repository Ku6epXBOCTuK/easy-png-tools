import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PAGES } from ".";

const MAP_PATH = fileURLToPath(
	new URL("../../../../docs/tools-map.md", import.meta.url),
);

const SECTION_START = /^## 1\.\s/;
const SECTION_PLANNED = /^## 2\.\s/;

// Все slug страниц содержат дефис, поэтому формат строгий: это отсекает слова
// описания вроде `median-cut` из «colors (k, median-cut)».
const ID_SHAPE = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;
const ID_TOKEN = /[a-z][a-z0-9]*(?:-[a-z0-9]+)+/g;

type Mention = { id: string; line: number };

/**
 * Буллиты раздела вместе с номером первой строки. Перенесённые строки
 * приклеиваются к буллету: иначе slug, оказавшийся на следующей строке, молча
 * выпадал бы из разбора и страница считалась бы неописанной.
 */
function sectionBullets(
	markdown: string,
	startPattern: RegExp,
	endPattern: RegExp | null,
): { text: string; line: number }[] {
	const lines = markdown.split("\n");
	const start = lines.findIndex((l) => startPattern.test(l));
	const end =
		endPattern === null
			? lines.length
			: lines.findIndex((l) => endPattern.test(l));
	if (start === -1 || end === -1 || end <= start) {
		throw new Error(
			`docs/tools-map.md: не найден раздел по ${startPattern} — тест не может ` +
				"определить границы разделов карты",
		);
	}

	const bullets: { text: string; line: number }[] = [];
	for (let i = start; i < end; i++) {
		const line = lines[i];
		const text = line.trim();
		const previous = bullets[bullets.length - 1];
		const isBullet = text.startsWith("- ");
		const isContinuation =
			previous !== undefined &&
			line.startsWith("  ") &&
			!/^#{1,6}\s/.test(text) &&
			!/^[-*]\s/.test(text);
		if (isBullet) {
			bullets.push({ text: text.slice(2), line: i + 1 });
		} else if (isContinuation) {
			previous.text += ` ${text}`;
		}
	}
	return bullets;
}

/**
 * Всё до первого тире `—` — slug через `/` или `,`; после тире свободное
 * описание параметров, оно не разбирается. Формат закреплён в самой карте.
 */
function mentionedIds(markdown: string): Mention[] {
	const found: Mention[] = [];
	for (const { text, line } of sectionBullets(
		markdown,
		SECTION_START,
		SECTION_PLANNED,
	)) {
		const head = text.split("—")[0];
		for (const raw of head.split(/[/,]/)) {
			const id = raw.trim().replace(/`/g, "");
			if (ID_SHAPE.test(id)) found.push({ id, line });
		}
	}
	return found;
}

/**
 * Плановые разделы «2. Можно добавить» и «3. Идеи» устроены прозой: slug стоит
 * где угодно в буллите, после тире и в скобках. Поэтому берём все токены
 * нужной формы из всего текста буллита, а не из «головы» до тире.
 */
function plannedIds(markdown: string): Mention[] {
	const found: Mention[] = [];
	for (const { text, line } of sectionBullets(
		markdown,
		SECTION_PLANNED,
		null,
	)) {
		for (const id of text.replace(/`/g, "").match(ID_TOKEN) ?? []) {
			found.push({ id, line });
		}
	}
	return found;
}

describe("docs/tools-map.md ↔ страницы реестра", () => {
	const markdown = readFileSync(MAP_PATH, "utf8");
	const mentioned = mentionedIds(markdown);
	const planned = plannedIds(markdown);
	const registrySlugs = new Set(PAGES.map((page) => page.slug));

	it("разбирает непустой список slug (парсер не сломался молча)", () => {
		expect(mentioned.length).toBeGreaterThan(0);
		expect(new Set(mentioned.map((m) => m.id)).size).toBeGreaterThan(50);
		expect(new Set(planned.map((m) => m.id)).size).toBeGreaterThan(10);
	});

	it("в карте нет slug, которых нет в реестре", () => {
		const bogus = mentioned.filter((m) => !registrySlugs.has(m.id));
		expect(
			bogus,
			bogus
				.map(
					(m) =>
						`${m.id} (docs/tools-map.md:${m.line}) — такой страницы нет в web/src/lib/registry/pages/`,
				)
				.join("\n"),
		).toEqual([]);
	});

	it("каждая страница реестра описана в карте", () => {
		const mentionedSet = new Set(mentioned.map((m) => m.id));
		const missing = [...registrySlugs].filter((id) => !mentionedSet.has(id));
		expect(
			missing,
			`не описаны в разделе «Реализовано»:\n${missing.join("\n")}`,
		).toEqual([]);
	});

	it("slug не продублированы между буллетами", () => {
		const seen = new Map<string, number>();
		const dupes: string[] = [];
		for (const { id, line } of mentioned) {
			const first = seen.get(id);
			if (first !== undefined) {
				dupes.push(`${id} (строки ${first} и ${line})`);
			} else {
				seen.set(id, line);
			}
		}
		expect(dupes, `повторяющиеся slug:\n${dupes.join("\n")}`).toEqual([]);
	});

	it("плановый slug уже не реализован (перенос из «2./3.» в «1.»)", () => {
		const stale = planned.filter((m) => registrySlugs.has(m.id));
		expect(
			stale,
			stale
				.map(
					(m) =>
						`${m.id} (docs/tools-map.md:${m.line}) — страница уже есть в реестре, ` +
						"перенеси её из планового раздела в «1. Реализовано»",
				)
				.join("\n"),
		).toEqual([]);
	});
});
