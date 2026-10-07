// Rule: NO STRING-LITERAL UNION TYPE ALIASES. A `type Kind = 'a' | 'b'`
// alias duplicates the literal set across files and derived aliases drift
// from the source; prefer one `as const` object + indexed access. Only
// TSTypeAliasDeclaration is checked. Details: web/eslint-plugins/README.md.

/** True when the union and all its (possibly nested) members are string literals. */
function allStringLiterals(/** @type {any} */ union) {
	for (const member of union.types) {
		if (member.type === "TSUnionType") {
			if (!allStringLiterals(member)) return false;
		} else if (member.type === "TSLiteralType") {
			const literal = member.literal;
			if (!(literal.type === "Literal" && typeof literal.value === "string")) {
				return false;
			}
		} else {
			return false;
		}
	}
	return true;
}

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Ban string-literal union type aliases in favor of an `as const` object plus `(typeof X)[keyof typeof X]`.",
			category: "TypeScript conventions",
			recommended: true,
		},
		schema: [],
		messages: {
			stringUnion:
				"Prefer one `as const` object over the string-literal union alias '{{name}}' — literal sets duplicated across types or files drift apart. Derive the type instead: `const {{constName}} = {...} as const; type {{name}} = (typeof {{constName}})[keyof typeof {{constName}}]`.",
		},
	},
	create(context) {
		return {
			TSTypeAliasDeclaration(node) {
				const annotation = node.typeAnnotation;
				if (!annotation || annotation.type !== "TSUnionType") return;
				if (!allStringLiterals(annotation)) return;
				context.report({
					node: node.id,
					messageId: "stringUnion",
					data: {
						name: node.id.name,
						constName: node.id.name.toUpperCase(),
					},
				});
			},
		};
	},
};
