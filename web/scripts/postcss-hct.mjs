// postcss-hct: PostCSS plugin that lets design tokens be authored as hct() and
// emits plain sRGB hex colors.
//
// Supported syntax (Material Design 3 HCT; hue 0–360, chroma 0–~120, tone 0–100):
//
//	--color-success: hct(155 40 55);                    // literal
//	--color-muted:   hct(from var(--brand-main) h 6 97); // take hue from seed
//	--brand-alt:     hct(from var(--brand-main) h c calc(t + 36)); // channel math
//
// `from` seeds are resolved from sibling custom properties in the same
// stylesheet (:root tokens plus the current rule's own tokens). Seeds may be
// #hex, oklch(), rgb() or another hct(). Anything the plugin cannot resolve is
// left as-is. The emitter is sRGB hex; HCT stays the single source of truth.

import { Color } from "@panmdaa/colors";

const HCT_RE = /\bhct\(/;
const VAR_RE = /^var\(\s*(--[\w-]+)\s*\)$/;

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function wrapHue(degrees) {
	return ((degrees % 360) + 360) % 360;
}

// --- postcss plugin entry -------------------------------------------------

const postcssHct = {
	postcssPlugin: "postcss-hct",
	Once(root, { result }) {
		// Fallback environment: tokens from :root (highest-level definitions).
		const rootEnv = collectTokensFromSelector(root, ":root");

		root.walkRules((rule) => {
			const env = new Map(rootEnv);
			const decls = [];
			rule.nodes?.forEach((node) => {
				if (node.type === "decl" && node.prop.startsWith("--")) {
					env.set(node.prop, node.value);
					decls.push(node);
				}
			});
			for (const decl of decls) {
				if (HCT_RE.test(decl.value)) {
					const next = replaceHctValues(decl, decl.value, env, result);
					if (next !== decl.value) {
						decl.value = next;
					}
				}
			}
		});
	},
};

function collectTokensFromSelector(root, selector) {
	const tokens = new Map();
	root.walkRules((rule) => {
		if (
			typeof rule.selector === "string" &&
			rule.selector
				.split(",")
				.map((s) => s.trim())
				.includes(selector)
		) {
			rule.walkDecls((decl) => {
				if (decl.prop.startsWith("--")) tokens.set(decl.prop, decl.value);
			});
		}
	});
	return tokens;
}

// --- value scanning -------------------------------------------------------

function findBalancedClosing(text, openParenIndex) {
	let depth = 0;
	for (let i = openParenIndex; i < text.length; i++) {
		if (text[i] === "(") depth++;
		else if (text[i] === ")") {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

function replaceHctValues(node, value, env, result) {
	let out = "";
	let cursor = 0;
	for (;;) {
		const start = value.indexOf("hct(", cursor);
		if (start === -1) {
			out += value.slice(cursor);
			break;
		}
		const end = findBalancedClosing(value, start + 3);
		if (end === -1) {
			out += value.slice(cursor);
			break;
		}
		out += value.slice(cursor, start);
		const inner = value.slice(start + 4, end);
		const hct = resolveHctBody(inner, env, new Set());
		if (hct) {
			out += Color.fromHct(hct.h, hct.c, hct.t).toHexColor();
		} else {
			result.warn(`postcss-hct: could not resolve hct(${inner})`, { node });
			out += value.slice(start, end + 1);
		}
		cursor = end + 1;
	}
	return out;
}

// --- hct() body parsing ---------------------------------------------------

// Resolve the body of one hct(...) call to { h, c, t } or null.
function resolveHctBody(inner, env, seen) {
	const text = inner.trim();
	if (!text) return null;

	if (text.startsWith("from ")) {
		const rest = text.slice(5).trimStart();
		if (!rest) return null;

		const scan = readSourceToken(rest);
		if (!scan) return null;
		const { source, remainder } = scan;

		const seed = resolveSeed(source, env, seen);
		if (!seed) return null;

		const parts = splitTopLevel(remainder, " ");
		if (parts.length !== 3) return null;

		const h = safeNumber(evalComponent(parts[0], seed));
		const c = safeNumber(evalComponent(parts[1], seed));
		const t = safeNumber(evalComponent(parts[2], seed));
		if (h === null || c === null || t === null) return null;
		return {
			h: wrapHue(h),
			c: Math.max(0, c),
			t: clamp(t, 0, 100),
		};
	}

	// Literal: hct(h c t)
	const parts = splitTopLevel(text, " ");
	if (parts.length !== 3) return null;
	const nums = parts.map((p) => Number.parseFloat(p));
	if (nums.some((n) => !Number.isFinite(n))) return null;
	return {
		h: wrapHue(nums[0]),
		c: Math.max(0, nums[1]),
		t: clamp(nums[2], 0, 100),
	};
}

function safeNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

// Read "var(--x)", "hct(...)", a color function or a bare token off the front.
function readSourceToken(text) {
	const first = text[0];
	if (first === "v") {
		const match = text.match(/^var\(\s*--[\w-]+\s*\)/);
		if (!match) return null;
		return {
			source: match[0],
			remainder: text.slice(match[0].length).trimStart(),
		};
	}
	if (first === "(" || first === "#" || /[a-z]/i.test(first)) {
		const match = text.match(/^[a-z]+\(/i);
		if (match) {
			const end = findBalancedClosing(text, text.indexOf("("));
			if (end === -1) return null;
			return {
				source: text.slice(0, end + 1),
				remainder: text.slice(end + 1).trimStart(),
			};
		}
		const bare = text.match(/^(#[\w.]+|-?[\d.]+)/i);
		if (!bare) return null;
		return {
			source: bare[1],
			remainder: text.slice(bare[1].length).trimStart(),
		};
	}
	return null;
}

// Split on a delimiter, ignoring delimiters inside balanced parentheses.
function splitTopLevel(text, delimiter) {
	const parts = [];
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

// --- seed resolution ------------------------------------------------------

function resolveSeed(source, env, seen) {
	if (VAR_RE.test(source.trim())) {
		const name = source.trim().match(VAR_RE)[1];
		const raw = env.get(name);
		if (raw === undefined) return null;
		if (seen.has(name)) return null; // circular reference
		seen.add(name);
		return resolveRawValue(raw, env, seen);
	}
	return parseColorValue(source.trim());
}

function resolveRawValue(raw, env, seen) {
	const text = raw.trim();
	if (text.startsWith("hct(") && text.endsWith(")")) {
		const inner = text.slice(4, -1);
		return resolveHctBody(inner, env, seen);
	}
	return parseColorValue(text);
}

// Parse a concrete color into HCT channels, or null.
function parseColorValue(text) {
	const value = text.trim();
	if (/^#[0-9a-f]{3}$/i.test(value)) {
		return channelsFromHex(expandShortHex(value));
	}
	if (/^#[0-9a-f]{6}$/i.test(value)) {
		return channelsFromHex(value);
	}
	// Split on whitespace; parseFloat drops "%"/"deg" units.
	const oklch = value.match(/^oklch\(([^)]+)\)/i);
	if (oklch) {
		const channels = oklch[1]
			.trim()
			.split(/\s+/)
			.map((ch) => Number.parseFloat(ch));
		if (channels.length !== 3 || channels.some((n) => !Number.isFinite(n)))
			return null;
		const [L, C, h] = channels;
		const hex = oklchToHex(L > 1 ? L / 100 : L, C, h);
		if (hex) return channelsFromHex(hex);
	}
	const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
	if (rgb) {
		const [r, g, b] = rgb.slice(1).map(Number);
		return channelsFromHex(hexFromRgb(r, g, b));
	}
	return null;
}

function channelsFromHex(hex) {
	try {
		const color = Color.from(hex);
		return { h: color.hue, c: color.chroma, t: color.tone };
	} catch {
		return null;
	}
}

function expandShortHex(hex) {
	return (
		"#" +
		hex
			.slice(1)
			.split("")
			.map((ch) => ch + ch)
			.join("")
	);
}

function oklchToHex(L, C, hDeg) {
	const hr = (hDeg * Math.PI) / 180;
	const a = C * Math.cos(hr);
	const b = C * Math.sin(hr);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3;
	const m = m_ ** 3;
	const s = s_ ** 3;
	const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
	const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
	const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
	return hexFromRgb(r * 255, g * 255, bl * 255);
}

function hexFromRgb(r, g, b) {
	const toByte = (v) =>
		clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
	return `#${toByte(r)}${toByte(g)}${toByte(b)}`;
}

// --- channel arithmetic ---------------------------------------------------

// Evaluate one hct() component: a channel ref (h/c/t), a number, or a calc()
// expression over the seed channels.
function evalComponent(text, seed) {
	const value = text.trim();
	if (value === "h" || value === "c" || value === "t") {
		return seed[value];
	}
	if (/^[-+]?[\d.]/.test(value)) {
		// unit-bearing number like "36deg"
		return Number.parseFloat(value);
	}
	return evaluateExpr(value, seed);
}

// --- tiny math evaluator for calc()/min()/max()/clamp() ---------------------

const MATH_FUNCS = new Set(["calc", "min", "max", "clamp"]);

// Lex and evaluate a calc() expression. Supported: numbers, + - * /,
// parentheses, channel refs (h/c/t) and the calc/min/max/clamp functions.
function evaluateExpr(text, seed) {
	return new ExprParser(text, seed).parse();
}

function tokenizeExpression(text) {
	const tokens = [];
	const re = /(\d+(?:\.\d+)?|\.\d+|[+\-*/(),]|[a-z]+)/g;
	let match;
	while ((match = re.exec(text)) !== null) {
		tokens.push(match[1]);
	}
	return tokens;
}

class ExprParser {
	constructor(text, seed) {
		this.tokens = tokenizeExpression(text);
		this.pos = 0;
		this.seed = seed;
	}

	peek() {
		return this.tokens[this.pos];
	}

	next() {
		return this.tokens[this.pos++];
	}

	parse() {
		const value = this.parseAdditive();
		return this.pos === this.tokens.length ? value : NaN;
	}

	parseAdditive() {
		let value = this.parseMulDiv();
		for (;;) {
			const op = this.peek();
			if (op !== "+" && op !== "-") break;
			this.pos++;
			const rhs = this.parseMulDiv();
			value = op === "+" ? value + rhs : value - rhs;
		}
		return value;
	}

	parseMulDiv() {
		let value = this.parseAtom();
		for (;;) {
			const op = this.peek();
			if (op !== "*" && op !== "/") break;
			this.pos++;
			const rhs = this.parseAtom();
			value = op === "*" ? value * rhs : value / rhs;
		}
		return value;
	}

	parseAtom() {
		const token = this.next();
		if (token === undefined) return NaN;
		if (token === "h" || token === "c" || token === "t") {
			return this.seed[token];
		}
		if (/^\d/.test(token)) return Number.parseFloat(token);
		if (token === "-") return -this.parseAtom();
		if (token === "+") return this.parseAtom();
		if (token === "(") {
			const value = this.parseAdditive();
			if (this.next() !== ")") return NaN;
			return value;
		}
		if (MATH_FUNCS.has(token)) {
			return this.parseFunction(token);
		}
		return NaN;
	}

	parseFunction(name) {
		if (this.next() !== "(") return NaN;
		const args = [this.parseAdditive()];
		while (this.peek() === ",") {
			this.pos++;
			args.push(this.parseAdditive());
		}
		if (this.next() !== ")") return NaN;
		if (name === "calc") return args[0];
		if (name === "min") return Math.min(...args);
		if (name === "max") return Math.max(...args);
		if (name === "clamp") {
			const [min, value, max] = args;
			return clamp(value, min, max);
		}
		return NaN;
	}
}

export default postcssHct;
