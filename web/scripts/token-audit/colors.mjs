// Color authorship: every color value in app.css must be authored as hct()
// — literals AND derived forms (hct(from var(...) h c t) with channel math) —
// so the whole palette is computed through HCT channels and output as sRGB by
// the postcss-hct plugin. Exceptions: the seed tokens --brand-main/--brand-alt
// (any format allowed) and color-mix(...) (the only sanctioned way to blend
// two tokens).

import { isColorValue } from "./helpers.mjs";

const BRAND_RE = /^--brand-(main|alt)$/;
const HCT_RE = /^hct\s*\(/i;
const COLOR_MIX_RE = /^color-mix\s*\(/i;

export function checkColorAuthorship(root) {
	const errors = [];
	root.walkDecls((decl) => {
		if (!decl.prop.startsWith("--")) return;
		if (BRAND_RE.test(decl.prop)) return;
		if (!isColorValue(decl.value)) return;
		if (HCT_RE.test(decl.value) || COLOR_MIX_RE.test(decl.value)) return;
		const where = decl.parent?.selector || decl.parent?.name || "";
		errors.push(
			`  ${decl.prop} (${where}): ${decl.value} — colors must be hct(); only --brand-main/--brand-alt may use other formats`,
		);
	});
	return errors;
}
