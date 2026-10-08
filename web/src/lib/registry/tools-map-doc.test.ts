import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PAGES } from ".";

const MAP_PATH = fileURLToPath(
	new URL("../../../../docs/tools-map.md", import.meta.url),
);

const SECTION_START = /^## 1\.\s/;
const SECTION_PLANNED = /^## 2\.\s/;

// Every page slug contains a hyphen, so the shape is strict: it excludes
// description words like `median-cut` in "colors (k, median-cut)".
const ID_SHAPE = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;
const ID_TOKEN = /[a-z][a-z0-9]*(?:-[a-z0-9]+)+/g;

type Mention = { id: string; line: number };

/**
 * Section bullets with the line number of the first line. Continuation lines
 * are glued to the bullet: otherwise a slug wrapped to the next line would
 * silently drop out of parsing and the page would count as undocumented.
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
			`docs/tools-map.md: section not found by ${startPattern} - the test ` +
				"cannot determine the map section boundaries",
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
 * Everything before the first em dash is slugs separated by `/` or `,`; the
 * free-form parameter description after the dash is not parsed. The format is
 * pinned by the map itself.
 */
function mentionedIds(markdown: string): Mention[] {
	const found: Mention[] = [];
	for (const { text, line } of sectionBullets(
		markdown,
		SECTION_START,
		SECTION_PLANNED,
	)) {
		const head = text.split("\u2014")[0];
		for (const raw of head.split(/[/,]/)) {
			const id = raw.trim().replace(/`/g, "");
			if (ID_SHAPE.test(id)) found.push({ id, line });
		}
	}
	return found;
}

/**
 * Planned sections "2."/"3." are prose: a slug may appear anywhere in the
 * bullet, after the dash or in parentheses. Take every token of the required
 * shape from the whole bullet, not just the head before the dash.
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

describe("docs/tools-map.md vs registry pages", () => {
	const markdown = readFileSync(MAP_PATH, "utf8");
	const mentioned = mentionedIds(markdown);
	const planned = plannedIds(markdown);
	const registrySlugs = new Set(PAGES.map((page) => page.slug));

	it("parses a non-empty slug list (parser did not silently break)", () => {
		expect(mentioned.length).toBeGreaterThan(0);
		expect(new Set(mentioned.map((m) => m.id)).size).toBeGreaterThan(50);
		expect(new Set(planned.map((m) => m.id)).size).toBeGreaterThan(10);
	});

	it("map has no slugs missing from the registry", () => {
		const bogus = mentioned.filter((m) => !registrySlugs.has(m.id));
		expect(
			bogus,
			bogus
				.map(
					(m) =>
						`${m.id} (docs/tools-map.md:${m.line}) - no such page in web/src/lib/registry/pages/`,
				)
				.join("\n"),
		).toEqual([]);
	});

	it("every registry page is described in the map", () => {
		const mentionedSet = new Set(mentioned.map((m) => m.id));
		const missing = [...registrySlugs].filter((id) => !mentionedSet.has(id));
		expect(
			missing,
			`not described in the "1. Implemented" section:\n${missing.join("\n")}`,
		).toEqual([]);
	});

	it("slugs are not duplicated between bullets", () => {
		const seen = new Map<string, number>();
		const dupes: string[] = [];
		for (const { id, line } of mentioned) {
			const first = seen.get(id);
			if (first !== undefined) {
				dupes.push(`${id} (lines ${first} and ${line})`);
			} else {
				seen.set(id, line);
			}
		}
		expect(dupes, `duplicate slugs:\n${dupes.join("\n")}`).toEqual([]);
	});

	it("planned slugs are not already implemented (move from 2./3. to 1.)", () => {
		const stale = planned.filter((m) => registrySlugs.has(m.id));
		expect(
			stale,
			stale
				.map(
					(m) =>
						`${m.id} (docs/tools-map.md:${m.line}) - the page is already in the registry, ` +
						'move it from a planned section to "1. Implemented"',
				)
				.join("\n"),
		).toEqual([]);
	});
});
