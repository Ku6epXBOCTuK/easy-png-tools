/**
 * Local ESLint plugin "i18n": cross-locale dictionary hygiene
 * (dict-consistency) and no hardcoded user text in templates. Warn-only by
 * design. Rule details: web/eslint-plugins/README.md.
 */
import dictConsistency from "./dict-consistency.js";
import noHardcodedUserText from "./no-hardcoded-user-text.js";

export default {
	meta: {
		name: "i18n",
		version: "0.1.0",
	},
	rules: {
		"dict-consistency": dictConsistency,
		"no-hardcoded-user-text": noHardcodedUserText,
	},
};
