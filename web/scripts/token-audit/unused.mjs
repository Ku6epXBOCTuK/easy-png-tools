// Unused tokens: defined in app.css but never referenced via var()
// anywhere in src. A dead token is not the single source of truth — it's dust.
// Reported as a warning; it does not fail the run. The `used` set is injectable
// so tests can pass a fixture instead of scanning src.

import { collectUsedTokens } from "./helpers.mjs";

export function checkUnused(root, used = collectUsedTokens()) {
	const defined = new Set();
	root.walkDecls((decl) => {
		if (decl.prop.startsWith("--")) defined.add(decl.prop);
	});
	return [...defined].filter((token) => !used.has(token));
}
