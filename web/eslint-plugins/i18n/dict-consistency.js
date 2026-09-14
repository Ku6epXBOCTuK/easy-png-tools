/**
 * Cross-locale dictionary linter (i18n/dict-consistency).
 *
 * Each locale dict in `lib/i18n/` is checked against ALL the others (not just
 * against the base locale). The set of locales comes from `LOCALES` in the
 * sibling `dict.ts`, so a new locale is picked up automatically — no rule
 * changes needed. The rule only ever warns (a missing translation must not
 * break the build) — see docs/plan-preview-i18n.md §Фаза 8.
 *
 * The diagnostic lives where the fix lives — each file reports its OWN gaps:
 *   - missing keys: the union of all keys is collected from the on-disk dicts;
 *     whatever the current file lacks is reported here (a missing whole
 *     section is reported once, not per descendant key);
 *   - empty values:  `""` or whitespace-only values;
 *   - placeholders:  for a shared key the `{name}` set is compared against the
 *     canonical set (the one shared by most locales, ties broken by LOCALES
 *     order) — catches a variable lost in translation exactly once, even when
 *     only one locale deviates.
 *
 * The rule self-filters: files whose basename is not one of LOCALES are
 * ignored, so it can be attached to the whole `lib/i18n/` directory.
 *
 * Options (object, all optional):
 *   - allowPaths: dot-path keys excluded from every check (conscious
 *     deviations until the dict reaches zero-warn, see Фаза 8 §8.3).
 */
import fs from "node:fs";
import path from "node:path";
import tseslint from "typescript-eslint";

const PLACEHOLDER = /\{(\w+)\}/g;

/** Parse a TS source string into an ESTree Program (syntax only). */
function parseTs(code, filename) {
	const result = tseslint.parser.parseForESLint(code, {
		filePath: filename,
		ecmaVersion: "latest",
		sourceType: "module",
	});
	return result.ast;
}

/** Unwrap `as const` / `satisfies` wrappers around a value node. */
function unwrap(node) {
	while (
		node &&
		(node.type === "TSAsExpression" || node.type === "TSSatisfiesExpression")
	) {
		node = node.expression;
	}
	return node;
}

/**
 * The exported dict `export const <name>: Dict = {...}` — the declarator id
 * (for reporting) and the object literal, or null.
 */
function findDictExport(ast) {
	for (const node of ast.body) {
		if (node.type !== "ExportNamedDeclaration") continue;
		const decl = node.declaration;
		if (!decl || decl.type !== "VariableDeclaration") continue;
		const d = decl.declarations[0];
		if (!d || d.id.type !== "Identifier") continue;
		const init = unwrap(d.init);
		if (init && init.type === "ObjectExpression") {
			return { id: d.id, object: init };
		}
	}
	return null;
}

/** The `LOCALES` list exported from `dict.ts`, or null. */
function findLocalesList(ast) {
	for (const node of ast.body) {
		if (node.type !== "ExportNamedDeclaration") continue;
		const decl = node.declaration;
		if (!decl || decl.type !== "VariableDeclaration") continue;
		for (const d of decl.declarations) {
			if (d.id.type !== "Identifier" || d.id.name !== "LOCALES") continue;
			const init = unwrap(d.init);
			if (init && init.type === "ArrayExpression") {
				return init.elements
					.map((el) => (isStringLiteral(el) ? el.value : null))
					.filter((v) => typeof v === "string");
			}
		}
	}
	return null;
}

/**
 * String literal node. The parser emits `Literal` in some ESTree versions and
 * `StringLiteral` in others — accept both.
 */
function isStringLiteral(node) {
	if (!node) return false;
	if (node.type === "StringLiteral") return true;
	return node.type === "Literal" && typeof node.value === "string";
}

const OBJECT = "object";
const STRING = "string";
const OPAQUE = "opaque";

/** Leaf kind of a property value (objects are followed, the rest are opaque). */
function entryKind(node) {
	if (node.type === "ObjectExpression") return OBJECT;
	if (isStringLiteral(node)) return STRING;
	if (
		node.type === "TemplateLiteral" &&
		node.expressions.length === 0 &&
		node.quasis.length === 1
	) {
		return STRING;
	}
	return OPAQUE;
}

function entryValue(node) {
	if (isStringLiteral(node)) return node.value;
	if (node.type === "TemplateLiteral") return node.quasis[0].value.cooked;
	return null;
}

function propKey(prop) {
	if (prop.key.type === "Identifier") return prop.key.name;
	if (isStringLiteral(prop.key)) return prop.key.value;
	return null;
}

/**
 * Flatten an exported dict object into `path -> { node, kind, value }`.
 * Computed properties are skipped; intermediate objects are recorded too, so a
 * missing whole section is reported once (children of a missing path are
 * skipped when reporting).
 */
function buildKeyMap(objectNode) {
	const map = new Map();
	const stack = [[objectNode, []]];
	while (stack.length > 0) {
		const [obj, prefix] = stack.pop();
		for (const prop of obj.properties) {
			if (prop.type !== "Property" || prop.computed) continue;
			const key = propKey(prop);
			if (key == null) continue;
			const dot = [...prefix, key].join(".");
			const kind = entryKind(prop.value);
			map.set(dot, {
				node: prop,
				kind,
				value: kind === STRING ? entryValue(prop.value) : null,
			});
			if (kind === OBJECT) stack.push([prop.value, [...prefix, key]]);
		}
	}
	return map;
}

function placeholders(value) {
	const set = new Set();
	for (const m of String(value).matchAll(PLACEHOLDER)) set.add(m[1]);
	return set;
}

function formatSet(set) {
	return `{${[...set].sort().join(", ")}}`;
}

/** Ancestor paths of a dot-path (e.g. `a.b` and `a` for `a.b.c`). */
function* ancestorPaths(key) {
	let i = key.lastIndexOf(".");
	while (i !== -1) {
		yield key.slice(0, i);
		i = key.lastIndexOf(".", i - 1);
	}
}

// Sibling dicts are read once per directory and cached for the whole lint run
// (mirrors how no-undefined-in-svelte caches the token dictionary).
const dirCache = new Map();

function loadDir(dir) {
	if (!dirCache.has(dir)) dirCache.set(dir, readDir(dir));
	return dirCache.get(dir);
}

function readDir(dir) {
	const dictPath = path.join(dir, "dict.ts");
	if (!fs.existsSync(dictPath)) return null;
	const ast = parseTs(fs.readFileSync(dictPath, "utf8"), dictPath);
	const locales = findLocalesList(ast);
	if (!locales || locales.length === 0) return null;

	const dicts = [];
	for (const locale of locales) {
		const file = path.join(dir, `${locale}.ts`);
		if (!fs.existsSync(file)) {
			// Declared in LOCALES but not yet translated — treated as an empty
			// dict so every key it lacks reports `missing key ... in <locale>`.
			dicts.push({ locale, map: new Map() });
			continue;
		}
		const dictAst = parseTs(fs.readFileSync(file, "utf8"), file);
		const dictExport = findDictExport(dictAst);
		if (!dictExport) continue;
		dicts.push({ locale, map: buildKeyMap(dictExport.object) });
	}

	// Union of every key across all locales (intermediate paths included), so a
	// file can report exactly what it is missing.
	const unionPaths = new Set();
	// Non-empty string leaves per key: loccales contribute to the canonical
	// placeholder set voting (empty values are already broken on their own).
	const stringLeaves = new Map();
	for (const d of dicts) {
		for (const [key, entry] of d.map) {
			unionPaths.add(key);
			if (entry.kind === STRING && (entry.value ?? "").trim() !== "") {
				if (!stringLeaves.has(key)) stringLeaves.set(key, []);
				stringLeaves.get(key).push(placeholders(entry.value));
			}
		}
	}

	// Canonical placeholder set per key: the set shared by the most locales;
	// on a tie the first one encountered (LOCALES order) wins.
	const canonicalSets = new Map();
	for (const [key, sets] of stringLeaves) {
		const counts = new Map();
		for (const set of sets) {
			const sig = [...set].sort().join("\u0000");
			counts.set(sig, (counts.get(sig) || 0) + 1);
		}
		let bestCount = 0;
		for (const set of sets) {
			const sig = [...set].sort().join("\u0000");
			if (counts.get(sig) > bestCount) {
				bestCount = counts.get(sig);
				canonicalSets.set(key, set);
			}
		}
	}

	return { locales, dicts, unionPaths, canonicalSets };
}

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Check cross-locale consistency of the i18n dicts in lib/i18n (warn-only).",
			category: "Best Practices",
		},
		schema: [
			{
				type: "object",
				properties: {
					allowPaths: {
						type: "array",
						items: { type: "string" },
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			missingKey: 'missing key "{{key}}" in {{locale}}',
			emptyValue: 'empty value "{{key}}" in {{locale}}',
			placeholderMismatch:
				'placeholder mismatch for "{{key}}" in {{locale}}: {{active}} vs expected {{expected}}',
		},
	},
	create(context) {
		const options = context.options[0] || {};
		const allowPaths = new Set(options.allowPaths || []);

		const filename = path.resolve(
			context.filename || context.physicalFilename || "",
		);
		const locale = path.basename(filename, path.extname(filename));
		const dirInfo = loadDir(path.dirname(filename));
		if (!dirInfo || !dirInfo.locales.includes(locale)) return {};

		const dictExport = findDictExport(context.sourceCode.ast);
		if (!dictExport) return {};

		const own = buildKeyMap(dictExport.object);

		// Missing keys: everything the union has but the current file lacks.
		// Top-level gaps only — a missing ancestor already covers its subtree.
		const missing = [...dirInfo.unionPaths].filter((k) => !own.has(k));
		const missingSet = new Set(missing);
		const topMissing = missing.filter(
			(k) => ![...ancestorPaths(k)].some((a) => missingSet.has(a)),
		);
		for (const key of topMissing) {
			if (allowPaths.has(key)) continue;
			context.report({
				node: dictExport.id,
				messageId: "missingKey",
				data: { key, locale },
			});
		}

		// Empty values and shared-key placeholder parity.
		for (const [key, entry] of own) {
			if (allowPaths.has(key) || entry.kind !== STRING) continue;
			if ((entry.value ?? "").trim() === "") {
				context.report({
					node: entry.node,
					messageId: "emptyValue",
					data: { key, locale },
				});
				continue;
			}
			const canonical = dirInfo.canonicalSets.get(key);
			if (!canonical) continue;
			const active = placeholders(entry.value);
			if (
				active.size === canonical.size &&
				[...active].every((p) => canonical.has(p))
			) {
				continue;
			}
			context.report({
				node: entry.node,
				messageId: "placeholderMismatch",
				data: {
					key,
					locale,
					active: formatSet(active),
					expected: formatSet(canonical),
				},
			});
		}

		return {};
	},
};
