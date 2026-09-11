// Rule: SVELTE 5 PROPS MUST USE A LOCAL `interface Props`.
//
// Convention (AGENTS.md): every typed props of a component is described by a
// local `interface Props`, and the props are destructured with the annotation:
//
//     interface Props {
//       label: string;
//       accent?: boolean;
//       children?: Snippet;
//     }
//     let { label, accent = false, children }: Props = $props();
//
// Banned instead:
//   - the inline generic `$props<{ ... }>()` — hard to read and splits the
//     type away from the file structure;
//   - untyped destructuring `let { ... } = $props()`;
//   - binding the whole props object (`const props = $props()`);
//   - any props type name other than the local `interface Props`.
//
// Inline `import('...')` type queries are NOT checked here: they are already
// banned by @typescript-eslint/consistent-type-imports.
//
// The check is purely syntactic (AST-level). Svelte's runes model guarantees
// $props() only exists in instance <script> blocks, so no scope/type info is
// needed. Interfaces are collected from every <script> (module + instance).

import { isInsideScriptElement } from "./utils.js";

export default {
	meta: {
		type: "suggestion",
		fixable: "code",
		docs: {
			description:
				"Require a local `interface Props` and `let { ... }: Props = $props()` for Svelte 5 props; ban inline generics, untyped destructuring and non-local props type names.",
			category: "Svelte conventions",
			recommended: true,
		},
		schema: [],
		messages: {
			inlineGeneric:
				"Avoid the inline generic `$props<T>()`; declare a local `interface Props` and destructure it: `let { ... }: Props = $props()`.",
			untypedDestructure:
				"Annotate the props destructuring with a local `interface Props`: `let { ... }: Props = $props()`.",
			noDestructure:
				"Destructure props with `let { ... }: Props = $props()` instead of binding the whole `$props()` object.",
			notNamedProps:
				"The props type must be the local `interface Props` (found '{{name}}').",
			inlineObjectType:
				"Declare a local `interface Props` instead of an inline object props type.",
			missingInterface:
				"No local `interface Props` is declared in this component; add one and use it as the props type.",
		},
	},
	create(context) {
		const interfaces = new Set();

		return {
			Program(node) {
				for (const child of node.body) {
					if (child.type !== "SvelteScriptElement") continue;
					for (const stmt of child.body ?? []) {
						if (stmt.type !== "TSInterfaceDeclaration") continue;
						interfaces.add(stmt.id.name);
					}
				}
			},

			CallExpression(node) {
				if (
					node.callee.type !== "Identifier" ||
					node.callee.name !== "$props"
				) {
					return;
				}
				if (!isInsideScriptElement(node)) return;

				// Inline generic $props<{ ... }>() is banned outright.
				if (node.typeArguments?.params?.length) {
					context.report({ node: node.callee, messageId: "inlineGeneric" });
					return;
				}

				let declarator = node.parent;
				while (declarator && declarator.type !== "VariableDeclarator") {
					declarator = declarator.parent;
				}
				if (!declarator) return;
				const id = declarator.id;

				if (id.type === "ObjectPattern") {
					const annotation = id.typeAnnotation?.typeAnnotation ?? null;
					if (annotation) {
						if (annotation.type === "TSTypeReference") {
							const typeName = annotation.typeName;
							if (!typeName || typeName.type !== "Identifier") return;
							if (typeName.name !== "Props") {
								context.report({
									node: typeName,
									messageId: "notNamedProps",
									data: { name: typeName.name },
								});
							} else if (!interfaces.has("Props")) {
								context.report({
									node: typeName,
									messageId: "missingInterface",
								});
							}
						} else if (annotation.type !== "TSImportType") {
							context.report({
								node: annotation,
								messageId: "inlineObjectType",
							});
						}
					} else {
						context.report({
							node: id,
							messageId: "untypedDestructure",
							...(interfaces.has("Props")
								? {
										fix: (fixer) => fixer.insertTextAfter(id, ": Props"),
									}
								: {}),
						});
					}
					return;
				}

				if (id.type === "Identifier") {
					context.report({ node: id, messageId: "noDestructure" });
				}
			},
		};
	},
};
