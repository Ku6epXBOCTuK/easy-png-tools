/**
 * Local ESLint plugin "conventions": cross-cutting code conventions the
 * recommended rule sets do not enforce. Rule details:
 * web/eslint-plugins/README.md.
 */
import asciiOnly from "./ascii-only.js";
import commentFormat from "./comment-format.js";
import commentsEnglish from "./comments-english.js";
import interfaceProps from "./interface-props.js";
import noStringUnionAlias from "./no-string-union-alias.js";

export default {
	meta: {
		name: "conventions",
		version: "0.1.0",
	},
	rules: {
		"ascii-only": asciiOnly,
		"comment-format": commentFormat,
		"comments-english": commentsEnglish,
		"interface-props": interfaceProps,
		"no-string-union-alias": noStringUnionAlias,
	},
};
