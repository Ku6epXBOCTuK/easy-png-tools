/**
 * Isolation rule: forbid mixing the "old" and the "new" (preview) branches.
 *
 * The rule RESOLVES every import specifier to a real file (handles both the
 * `$lib/...` alias and relative `./` / `../` paths), classifies the source
 * file and each import target by their actual location, and reports whenever an
 * "old" file imports a "new" one or vice versa. Files that match neither side
 * are "shared" (core/, i18n/, theme, assets, tests, ...) and can import freely.
 *
 * Options (object, all optional):
 *   - root:   path from lint cwd to the source dir (default "src");
 *   - alias:  { $lib: "lib" } — alias -> dir relative to root;
 *   - old, new: gitignore-style glob lists for the two branches. Both default
 *     to the current layout so that moving a module between branches is a
 *     one-line config change (e.g. everything old will live under `old/`).
 */
import fs from "node:fs";
import path from "node:path";

const DEFAULT_OLD = ["routes/(old)/**", "lib/old/**"];

const DEFAULT_NEW = [
	"routes/preview/**",
	"lib/components/kit/**",
	"lib/preview/**",
	"lib/registry-new/**",
	"lib/registry-schema.ts",
	"lib/registry-schema.test.ts",
];

/** Escape everything except glob metacharacters, then handle **, *, ?. */
function globToRegExp(glob) {
	let out = "^";
	for (let i = 0; i < glob.length; i++) {
		const ch = glob[i];
		if (ch === "*" && glob[i + 1] === "*") {
			out += ".*";
			i++;
		} else if (ch === "*") {
			out += "[^/]*";
		} else if (ch === "?") {
			out += "[^/]";
		} else if ("\\^$.|?*+()[]{}".includes(ch)) {
			out += `\\${ch}`;
		} else {
			out += ch;
		}
	}
	return new RegExp(out + "$");
}

/** gitignore-style: last-match-wins, `!` negates earlier positives. */
function matchesGlobList(patterns, rel) {
	let included = false;
	for (const raw of patterns) {
		const negated = raw.startsWith("!");
		const pattern = negated ? raw.slice(1) : raw;
		if (globToRegExp(pattern).test(rel)) {
			if (negated) return false;
			included = true;
		}
	}
	return included;
}

/** First existing candidate when resolving a bare path (no extension known). */
function firstExisting(base) {
	const candidates = [
		base,
		`${base}.ts`,
		`${base}.svelte`,
		`${base}.svelte.ts`,
		`${base}/index.ts`,
		`${base}/index.svelte`,
	];
	for (const c of candidates) {
		try {
			if (fs.statSync(c).isFile()) return c;
		} catch {
			// keep trying
		}
	}
	return null;
}

function toPortable(p) {
	return p.replace(/\\/g, "/");
}

export default {
	meta: {
		type: "problem",
		docs: {
			description:
				"Forbid imports between the old UI branch and the new (preview) branch.",
			category: "Best Practices",
		},
		schema: [
			{
				type: "object",
				properties: {
					root: { type: "string" },
					alias: { type: "object", additionalProperties: { type: "string" } },
					old: { type: "array", items: { type: "string" } },
					new: { type: "array", items: { type: "string" } },
				},
				additionalProperties: false,
			},
		],
		messages: {
			noMixed:
				'Isolation violation: "{{side}}" file imports "{{target}}" ({{targetRel}}).',
		},
	},
	create(context) {
		const options = context.options[0] || {};
		const cwd = context.cwd;
		const srcRoot = path.resolve(cwd, options.root || "src");
		const alias = options.alias || { $lib: "lib" };
		const oldPatterns = options.old || DEFAULT_OLD;
		const newPatterns = options.new || DEFAULT_NEW;

		/** Classify a path (already absolute or portable rel to srcRoot). */
		function classify(absOrRel, relativeToRoot) {
			const rel = relativeToRoot
				? absOrRel
				: toPortable(path.relative(srcRoot, absOrRel));
			// new wins over old if a path is matched by both (e.g. components/kit
			// is != lib/components/** via negation, but keep precedence safe).
			if (matchesGlobList(newPatterns, rel)) return "new";
			if (matchesGlobList(oldPatterns, rel)) return "old";
			return "shared";
		}

		/** Resolve a specifier to a portable rel path from srcRoot, or null. */
		function resolveToRel(spec, currentDir) {
			if (spec.startsWith("$")) {
				const dot = spec.indexOf("/");
				const mapKey = spec.slice(0, dot === -1 ? spec.length : dot);
				const dir = alias[mapKey];
				if (!dir) return null;
				const rest = dot === -1 ? "" : spec.slice(dot + 1);
				const base = path.resolve(srcRoot, dir, rest);
				const found = firstExisting(base);
				if (!found) return null;
				return toPortable(path.relative(srcRoot, found));
			}
			if (spec.startsWith("./") || spec.startsWith("../")) {
				const base = path.resolve(currentDir, spec);
				const found = firstExisting(base);
				if (!found) return null;
				const rel = path.relative(srcRoot, found);
				if (rel.startsWith("..")) return null; // outside srcRoot
				return toPortable(rel);
			}
			return null; // package import (svelte, vitest, @lucide, ...)
		}

		const filename = context.filename || context.physicalFilename;
		const currentAbs = path.resolve(filename);
		const currentRel = toPortable(path.relative(srcRoot, currentAbs));
		const currentSide = classify(currentRel, true);
		const currentDir = path.dirname(currentAbs);

		if (currentSide === "shared") return {};

		function checkSource(node) {
			const spec = node.source?.value;
			if (typeof spec !== "string") return;
			const targetRel = resolveToRel(spec, currentDir);
			if (!targetRel) return;
			const targetSide = classify(targetRel, true);
			if (
				(currentSide === "old" && targetSide === "new") ||
				(currentSide === "new" && targetSide === "old")
			) {
				context.report({
					node,
					messageId: "noMixed",
					data: { side: currentSide, target: targetSide, targetRel },
				});
			}
		}

		return {
			ImportDeclaration: checkSource,
			ImportExpression: checkSource,
			ExportNamedDeclaration: checkSource,
			ExportAllDeclaration: checkSource,
		};
	},
};
