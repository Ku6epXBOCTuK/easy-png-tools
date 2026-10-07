// Unresolved references: every var(--x) in app.css must point at a token the
// same file defines: a typo silently drops the declaration, so this is a
// defect, not a style choice. `var(--x, fallback)` is legal without --x.

const VAR_REF_RE = /var\(\s*(--[\w-]+)\s*([,)])/g;

export function checkUnresolvedRefs(root) {
	const defined = new Set();
	root.walkDecls((decl) => {
		if (decl.prop.startsWith("--")) defined.add(decl.prop);
	});

	const errors = [];
	const seen = new Set();
	root.walkDecls((decl) => {
		for (const match of decl.value.matchAll(VAR_REF_RE)) {
			const [, token, terminator] = match;
			// terminator ")" after whitespace means no fallback argument
			if (defined.has(token)) continue;
			if (terminator === ",") continue;
			if (seen.has(token)) continue;
			seen.add(token);
			const where = decl.parent?.selector || decl.parent?.name || "";
			errors.push(
				`  ${token} used in ${where} (${decl.prop}) is not defined in app.css`,
			);
		}
	});
	return errors;
}
