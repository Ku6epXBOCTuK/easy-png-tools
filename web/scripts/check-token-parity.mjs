// Token parity check: every color token defined in `:root` (light theme) of the
// design CSS must also be defined in `[data-theme="dark"]`, and vice versa. A
// color that exists only in one theme silently breaks dark mode.
//
// Usage: pnpm --dir web exec node scripts/check-token-parity.mjs
// Exit code 1 (and a report) when tokens are missing.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const FILE = new URL("../src/preview.css", import.meta.url);
const SRC_DIR = fileURLToPath(new URL("../src/", import.meta.url));

// A var(--x) REFERENCE anywhere in the app (primary argument only).
const USAGE_RE = /var\(\s*(--[\w-]+)/g;

const SCAN_EXTS = new Set([".svelte", ".css", ".ts", ".js", ".mjs"]);

// Recursively list source files; no glob dependency needed.
function listFiles(dir) {
	const files = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			files.push(...listFiles(full));
		} else if (SCAN_EXTS.has(name.slice(name.lastIndexOf(".")))) {
			files.push(full);
		}
	}
	return files;
}

// Collect every token referenced via var() across all source files.
function collectUsedTokens() {
	const used = new Set();
	for (const file of listFiles(SRC_DIR)) {
		const content = readFileSync(file, "utf8");
		for (const match of content.matchAll(USAGE_RE)) {
			used.add(match[1]);
		}
	}
	return used;
}

// A token is "colorful" when its value is a color literal — those must have a
// dark-mate. Non-color tokens (fonts, radii, durations) are exempt.
const COLOR_RE =
	/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklch|oklab)\s*\(/i;

const isColorValue = (value) => COLOR_RE.test(value);

// A token is "derived" when its value references var(...) — it adapts to the
// theme automatically (e.g. --brand-alt: oklch(from var(--brand-main) ...)),
// so it must NOT have a hardcoded dark twin.
const isDerived = (value) => value.includes("var(");

// Collect { token: value } custom properties defined inside a given selector.
function collectTokens(root, selector) {
	const map = new Map();
	root.walkRules((rule) => {
		if (rule.selector === selector) {
			rule.walkDecls((decl) => {
				if (decl.prop.startsWith("--")) map.set(decl.prop, decl.value);
			});
		}
	});
	return map;
}

async function main() {
	const css = await readFile(FILE, "utf8");
	const root = postcss.parse(css);

	const light = collectTokens(root, ":root");
	const dark = collectTokens(root, '[data-theme="dark"]');

	const errors = [];

	// Every colorful light token must have a dark-mate (derived tokens excluded).
	for (const [token, value] of light) {
		if (!isColorValue(value) || isDerived(value)) continue;
		if (!dark.has(token)) {
			errors.push(`  ${token} in :root has no [data-theme="dark"] override`);
		}
	}

	// Every dark token must exist in :root (a dark-only token is orphaned).
	for (const [token] of dark) {
		if (!light.has(token)) {
			errors.push(`  ${token} in [data-theme="dark"] is missing in :root`);
		}
	}

	if (errors.length > 0) {
		console.log(`Token parity violations in ${FILE}:\n${errors.join("\n")}`);
		process.exitCode = 1;
	} else {
		console.log(
			"Token parity: OK — all color tokens have both light/dark forms.",
		);
	}

	// Unused design tokens: defined in preview.css but never used anywhere in
	// src via var(). A dead token is not the single source of truth — it's dust.
	const defined = new Set();
	root.walkDecls((decl) => {
		if (decl.prop.startsWith("--")) defined.add(decl.prop);
	});
	const used = collectUsedTokens();
	const unused = [...defined].filter((token) => !used.has(token));
	if (unused.length > 0) {
		console.log("\nUnused tokens (defined in preview.css, never used):");
		for (const token of unused) console.log(`  ${token}`);
	} else {
		console.log("All preview.css tokens are used somewhere.");
	}
}

main().catch((error) => {
	console.log(error);
	process.exitCode = 1;
});
