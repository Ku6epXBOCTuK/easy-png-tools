import { describe, expect, it } from "vitest";
// @ts-expect-error node types are not wired into svelte-check; vitest resolves fine
import { readFileSync } from "node:fs";

declare const process: { cwd(): string };

const css = readFileSync("src/app.css", "utf8");

type Tokens = Record<string, string>;

function parseBlock(css: string, selector: string): Tokens {
	const escaped = selector.replace("[", "\\[").replace("]", "\\]");
	const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
	const tokens: Tokens = {};
	for (const [, name, value] of (match?.[1] ?? "").matchAll(
		/--([a-z-]+):\s*([^;]+);/g,
	)) {
		tokens[name] = value.trim();
	}
	return tokens;
}

function resolveVar(tokens: Tokens, value: string): string {
	const ref = /^var\(--([a-z-]+)\)$/.exec(value);
	return ref ? (tokens[ref[1]] ?? value) : value;
}

function luminance(hex: string): number {
	const full =
		hex.length === 4
			? hex
					.slice(1)
					.split("")
					.map((c) => c + c)
					.join("")
			: hex.slice(1);
	const [r, g, b] = [0, 2, 4]
		.map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fgHex: string, bgHex: string): number {
	const a = luminance(fgHex);
	const b = luminance(bgHex);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function mix(fgHex: string, alpha: number, bgHex: string): string {
	const parse = (h: string) =>
		[0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16));
	const f = parse(fgHex);
	const b = parse(bgHex);
	const out = f.map((v, i) => Math.round(alpha * v + (1 - alpha) * b[i]));
	return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const cssText = css;
const light = parseBlock(css, ":root");
const darkRaw = parseBlock(css, "[data-theme='dark']");
const dark: Tokens = { ...light, ...darkRaw };

function colorOf(theme: Tokens, name: string): string {
	return resolveVar(theme, theme[name]);
}

function bannerBg(theme: Tokens): string {
	return mix(colorOf(theme, "danger"), 0.08, colorOf(theme, "surface"));
}

describe.each([
	["light", light],
	["dark", dark],
])("контраст палитры (%s)", (_name, theme) => {
	const c = (n: string) => colorOf(theme, n);

	it("основной текст на поверхности ≥ 7", () => {
		expect(ratio(c("text"), c("surface"))).toBeGreaterThanOrEqual(7);
	});

	it("вторичный текст на фоне и поверхности ≥ 4.5", () => {
		expect(ratio(c("text-muted"), c("surface"))).toBeGreaterThanOrEqual(4.5);
		expect(ratio(c("text-muted"), c("bg"))).toBeGreaterThanOrEqual(4.5);
	});

	it("цвет ссылок на поверхности и фоне ≥ 4.5", () => {
		expect(ratio(c("link"), c("surface"))).toBeGreaterThanOrEqual(4.5);
		expect(ratio(c("link"), c("bg"))).toBeGreaterThanOrEqual(4.5);
	});

	it("белая подпись на акцентной кнопке ≥ 4.5", () => {
		expect(ratio(c("accent-contrast"), c("accent"))).toBeGreaterThanOrEqual(
			4.5,
		);
	});

	it("текст баннера ошибки ≥ 4.5", () => {
		expect(ratio(c("danger-strong"), bannerBg(theme))).toBeGreaterThanOrEqual(
			4.5,
		);
	});

	it("бордер панели различим ≥ 1.15", () => {
		expect(ratio(c("border"), c("surface"))).toBeGreaterThanOrEqual(1.15);
	});
});
