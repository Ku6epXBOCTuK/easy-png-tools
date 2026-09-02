// Theme parity: every color token in `:root` must also exist in
// `[data-theme="dark"]` and vice versa. A color defined in only one theme
// silently breaks dark mode. Derived tokens (values containing var()) adapt
// to the theme automatically and are exempt.

import { isColorValue, isDerived } from "./helpers.mjs";

export function checkParity({ light, dark }) {
	const errors = [];

	// Every colorful light token must have a dark-mate (derived excluded).
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

	return errors;
}
