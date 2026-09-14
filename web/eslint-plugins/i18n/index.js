/**
 * Local ESLint plugin "i18n".
 *
 * Cross-locale dictionary hygiene (i18n/dict-consistency): every locale dict in
 * `lib/i18n/` is compared against all the others — key parity, empty values,
 * `{placeholder}` parity — warn-only by design (a missing translation must not
 * break the build). The set of locales comes from `LOCALES` in `dict.ts`, so
 * new locales are picked up automatically.
 */
import dictConsistency from "./dict-consistency.js";

export default {
	meta: {
		name: "i18n",
		version: "0.1.0",
	},
	rules: {
		"dict-consistency": dictConsistency,
	},
};
