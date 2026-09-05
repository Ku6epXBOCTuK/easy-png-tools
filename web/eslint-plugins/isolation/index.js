/**
 * Local ESLint plugin "isolation".
 *
 * Guarantees full isolation between the old UI branch and the new (preview)
 * branch. Unlike no-restricted-imports (which matches the literal import
 * specifier string only), these rules RESOLVE the specifier to a real file
 * (supporting both `$lib/...` aliases and relative `./`/`../` paths) and then
 * classify both sides by their actual location on disk.
 *
 * Why this is needed:
 *  - old code imports new things via RELATIVE paths (e.g. `../registry-schema`),
 *    which `$lib/...` glob patterns cannot catch;
 *  - the same target can be written many ways (`$lib/x`, `../x`, `../../x`),
 *    so enumerating literal strings is fragile.
 *
 * Configuration (per rule options):
 *   - `root`: path from the lint cwd to the source root (default "src");
 *   - `alias`: mapping from import aliases to dirs relative to root
 *     (default { "$lib": "lib" });
 *   - `old`, `new`: glob patterns (gitignore-style, `!` = negation) for the two
 *     branches. Files matched by neither are "shared" and unrestricted.
 */
import noMixedImports from "./no-mixed-imports.js";

export default {
	meta: {
		name: "isolation",
		version: "1.0.0",
	},
	rules: {
		"no-mixed-imports": noMixedImports,
	},
};
