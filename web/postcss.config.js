import postcssHct from "./scripts/postcss-hct.mjs";
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";

export default {
	plugins: [
		// Breakpoints live only in preview.css (next to the --bp-* tokens);
		// global-data injects them so @media (--bp-*) expands in every file.
		postcssGlobalData({
			files: ["src/preview.css"],
		}),
		postcssCustomMedia({
			preserve: false,
		}),
		postcssHct,
	],
};
