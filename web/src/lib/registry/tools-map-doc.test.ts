import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { TOOLS } from ".";

const MAP_PATH = fileURLToPath(
	new URL("../../../../docs/tools-map.md", import.meta.url),
);

const SECTION_START = /^## 1\.\s/;
const SECTION_END = /^## 2\.\s/;

// Все id в реестре содержат дефис, поэтому формат строгий: это отсекает слова
// описания вроде `median-cut` из «colors (k, median-cut)».
const ID_SHAPE = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;

type Mention = { id: string; line: number };

/**
 * Буллиты раздела «1. Реализовано» вместе с номером первой строки.
 * Перенесённые строки приклеиваются к буллету: иначе id, оказавшийся на
 * следующей строке, молча выпадал бы из разбора и инструмент считался бы
 * неописанным.
 */
function implementedBullets(
	markdown: string,
): { text: string; line: number }[] {
	const lines = markdown.split("\n");
	const start = lines.findIndex((l) => SECTION_START.test(l));
	const end = lines.findIndex((l) => SECTION_END.test(l));
	if (start === -1 || end === -1 || end <= start) {
		throw new Error(
			"docs/tools-map.md: не найден раздел «1. Реализовано» или «2.» — " +
				"тест разбирает только реализованные инструменты",
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
			bullets.push({ text: text.slice(2), line: start + i + 1 });
		} else if (isContinuation) {
			previous.text += ` ${text}`;
		}
	}
	return bullets;
}

/**
 * Всё до первого тире `—` — id через `/` или `,`; после тире свободное
 * описание параметров, оно не разбирается. Формат закреплён в самой карте.
 */
function mentionedIds(markdown: string): Mention[] {
	const found: Mention[] = [];
	for (const { text, line } of implementedBullets(markdown)) {
		const head = text.split("—")[0];
		for (const raw of head.split(/[/,]/)) {
			const id = raw.trim().replace(/`/g, "");
			if (ID_SHAPE.test(id)) found.push({ id, line });
		}
	}
	return found;
}

describe("docs/tools-map.md ↔ реестр", () => {
	const markdown = readFileSync(MAP_PATH, "utf8");
	const mentioned = mentionedIds(markdown);
	const registryIds = new Set(TOOLS.map((t) => t.id));

	it("разбирает непустой список id (парсер не сломался молча)", () => {
		expect(implementedBullets(markdown).length).toBeGreaterThan(0);
		expect(new Set(mentioned.map((m) => m.id)).size).toBeGreaterThan(50);
	});

	it("в карте нет id, которых нет в реестре", () => {
		const bogus = mentioned.filter((m) => !registryIds.has(m.id));
		expect(
			bogus,
			bogus
				.map(
					(m) =>
						`${m.id} (docs/tools-map.md:${m.line}) — такого инструмента нет в web/src/lib/registry/`,
				)
				.join("\n"),
		).toEqual([]);
	});

	it("каждый инструмент реестра описан в карте", () => {
		const mentionedSet = new Set(mentioned.map((m) => m.id));
		const missing = [...registryIds].filter((id) => !mentionedSet.has(id));
		expect(
			missing,
			`не описаны в разделе «Реализовано»:\n${missing.join("\n")}`,
		).toEqual([]);
	});

	it("id не продублированы между буллетами", () => {
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
		expect(dupes, `повторяющиеся id:\n${dupes.join("\n")}`).toEqual([]);
	});
});
