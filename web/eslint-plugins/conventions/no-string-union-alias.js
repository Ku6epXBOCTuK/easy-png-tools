// Rule: NO STRING-LITERAL UNION TYPE ALIASES.
//
// A type alias whose members are all string literals (`type Kind = 'a' | 'b'`)
// duplicates the literal set: the same set is re-typed in many places, and new
// "derived" aliases (`type Kind2 = 'a' | 'c'`) appear that drift from the
// source. Prefer a single `as const` object as the source of truth and derive
// the type from it with indexed access.
//
//     const KIND = { a: ..., b: ..., c: ... } as const;
//     type Kind = (typeof KIND)[keyof typeof KIND];
//
// Only TSTypeAliasDeclaration is checked — inline unions in parameter or
// property types (one-off uses) are left alone.

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
