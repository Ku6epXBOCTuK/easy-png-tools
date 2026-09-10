import { Color } from "@panmdaa/colors";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

declare const process: { cwd(): string };

const css = readFileSync("src/app.css", "utf8");

type Hct = { h: number; c: number; t: number };

const hctCache = new Map<string, Hct>();

function resolveHct(value: string, env: Map<string, string>): Hct | null {
	const key = `${value}@${env.get("--brand-main")}`;
	const cached = hctCache.get(key);
	if (cached) return cached;
	const out = resolveHctRaw(value, env, new Set());
	if (out) hctCache.set(key, out);
	return out;
}

function resolveHctRaw(
	value: string,
	env: Map<string, string>,
	seen: Set<string>,
): Hct | null {
	const text = value.trim();
	const literal = text.match(/^hct\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
	if (literal) {
		return { h: +literal[1], c: +literal[2], t: +literal[3] };
	}

	const from = text.match(/^hct\(from\s+var\((--[\w-]+)\)\s+(.+)\)$/s);
	if (!from) return null;
	const seedTokens = env.get(from[1]);
	if (seedTokens === undefined || seen.has(from[1])) return null;
	const seenNext = new Set(seen);
	seenNext.add(from[1]);
	const seed = resolveHct(seedTokens, env) ?? fromHex(seedTokens);
	if (!seed) return null;

	const channels = splitTopLevel(from[2], " ");
	if (channels.length !== 3) return null;
	const h = channel(channels[0], seed);
	const c = channel(channels[1], seed);
	const t = channel(channels[2], seed);
	if (h === null || c === null || t === null) return null;
	return { h: ((h % 360) + 360) % 360, c: Math.max(0, c), t: clamp(t, 0, 100) };
}

function channel(raw: string, seed: Hct): number | null {
	const text = raw.trim();
	if (text === "h") return seed.h;
	if (text === "c") return seed.c;
	if (text === "t") return seed.t;
	const calc = /^calc\(\s*([htc])\s*([+-])\s*([\d.]+)\s*\)$/.exec(text);
	if (calc) {
		const base = seed[calc[1] as keyof Hct];
		return calc[2] === "+" ? base + +calc[3] : base - +calc[3];
	}
	const num = Number.parseFloat(text);
	return Number.isFinite(num) ? num : null;
}

function splitTopLevel(text: string, delimiter: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let current = "";
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch === "(") depth++;
		else if (ch === ")") depth--;
		if (ch === delimiter && depth === 0) {
			if (current.trim()) parts.push(current.trim());
			current = "";
		} else {
			current += ch;
		}
	}
	if (current.trim()) parts.push(current.trim());
	return parts;
}

function fromHex(hex: string): Hct | null {
	const m = /^#[0-9a-f]{6}$/i.exec(hex.trim());
	if (!m) return null;
	const c = Color.from(m[0] as `#${string}`);
	return { h: c.hue, c: c.chroma, t: c.tone };
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function parseTheme(css: string, selector: RegExp): Map<string, string> {
	const env = new Map<string, string>();
	const match = css.match(selector);
	for (const [, name, value] of (match?.[1] ?? "").matchAll(
		/--([a-z-]+):\s*([^;]+);/g,
	)) {
		env.set(`--${name}`, value.trim());
	}
	return env;
}

const lightEnv = parseTheme(css, /:root\s*\{([^}]*)\}/);
const darkEnv = parseTheme(css, /\[data-theme="dark"\]\s*\{([^}]*)\}/);

function colorOf(env: Map<string, string>, name: string): string {
	const raw = env.get(name);
	if (!raw) throw new Error(`missing token ${name}`);
	const hct = resolveHct(raw, env) ?? fromHex(raw);
	if (!hct) throw new Error(`cannot resolve ${raw}`);
	return Color.fromHct(hct.h, hct.c, hct.t).toHexColor();
}

function luminance(hex: string): number {
	const full = hex.slice(1);
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

describe.each([
	["light", lightEnv],
	["dark", darkEnv],
])("контраст палитры (%s)", (_name, theme) => {
	it("основной текст на фоне и панели ≥ 4.5", () => {
		expect(
			ratio(
				colorOf(theme, "--color-text"),
				colorOf(theme, "--color-background"),
			),
		).toBeGreaterThanOrEqual(4.5);
		expect(
			ratio(colorOf(theme, "--color-text"), colorOf(theme, "--color-panel")),
		).toBeGreaterThanOrEqual(4.5);
	});

	it("вторичный текст (muted) на фоне и панели ≥ 4.5", () => {
		expect(
			ratio(
				colorOf(theme, "--color-text-muted"),
				colorOf(theme, "--color-background"),
			),
		).toBeGreaterThanOrEqual(4.5);
		expect(
			ratio(
				colorOf(theme, "--color-text-muted"),
				colorOf(theme, "--color-panel"),
			),
		).toBeGreaterThanOrEqual(4.5);
	});

	it("текст-цвет на акцентной кнопке ≥ 4.0 (AA large-text)", () => {
		expect(
			ratio(
				colorOf(theme, "--color-background"),
				colorOf(theme, "--color-main"),
			),
		).toBeGreaterThanOrEqual(4.0);
		expect(
			ratio(
				colorOf(theme, "--color-background"),
				colorOf(theme, "--color-accent"),
			),
		).toBeGreaterThanOrEqual(4.0);
	});

	it("бордер панели различим на фоне ≥ 1.15", () => {
		expect(
			ratio(
				colorOf(theme, "--color-border"),
				colorOf(theme, "--color-background"),
			),
		).toBeGreaterThanOrEqual(1.15);
	});
});
