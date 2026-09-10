// Unused tokens: defined in app.css but never referenced via var()
// anywhere in src. A dead token is not the single source of truth — it's dust.
// Reported as a warning; it does not fail the run.

import { collectUsedTokens } from "./helpers.mjs";

export function checkUnused(root) {
	const defined = new Set();
	root.walkDecls((decl) => {
		if (decl.prop.startsWith("--")) defined.add(decl.prop);
	});
	const used = collectUsedTokens();
	return [...defined].filter((token) => !used.has(token));
}
