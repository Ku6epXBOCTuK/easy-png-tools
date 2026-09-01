// Stylelint config — design-token enforcement for easy-png-tools.
// FWHM: keeps the design system a single source of truth. Colors and sizes must
// come from prefixed tokens; direct color values are allowed only for the two
// brand tokens. old.css is the legacy design and is ignored (removed later).

export default {
	extends: ["stylelint-config-standard"],
	ignoreFiles: [
		"src/old.css",
		"**/node_modules/**",
		"**/build/**",
		"**/.svelte-kit/**",
		"**/static/**",
	],
	rules: {
		// Rule: every CSS variable must carry a system prefix so the design
		// vocabulary stays a single, greppable source of truth.
		// The two brand tokens (brand-main / brand-alt) are the only
		// exceptions that may exist as-is.
		// NOTE: stylelint tests the pattern against the property WITHOUT the
		// leading "--", so the regex must NOT start with --.
		// Regex: either an exact brand token or a prefixed token:
		//   ^(brand-main|brand-alt)$                         — brand exceptions
		//   |^(color|space|text|radius|bp|font)-             — prefixed
		"custom-property-pattern": [
			"^(brand-main|brand-alt)$|^(color|space|text|radius|bp|font)-",
			{
				message:
					'"%s" must be prefixed: --color-*, --space-*, --text-*, --radius-*, --bp-*, --font-*; brand: only --brand-main/--brand-alt',
			},
		],
		// Rule: !important is banned in CSS files. Overriding a look must happen
		// through tokens/layers, not by force. (Not part of the standard set.)
		"declaration-no-important": true,
		// Grouping whitespace for the token file. The standard config puts
		// "after-custom-property" into `except`, which makes --fix DELETE blank
		// lines between consecutive custom properties — so color/size token groups
		// collapse into one wall. Moving it to `ignore` frees blank lines between
		// tokens (groups stay readable); the blank line is still REQUIRED before a
		// token that follows a regular declaration.
		"custom-property-empty-line-before": [
			"always",
			{
				except: ["first-nested"],
				ignore: [
					"after-custom-property",
					"after-comment",
					"inside-single-line-block",
				],
			},
		],
	},
	overrides: [
		{
			// Applies to every CSS file EXCEPT old.css (already in ignoreFiles) —
			// the legacy design is exempt and will be removed later.
			files: ["src/**/*.css"],
			rules: {
				// Rule: only --brand-main and --brand-alt may set a color
				// directly (hex/rgb/hsl/named). Every other color token must be oklch().
				// The key matches ANY custom property EXCEPT the two brand exceptions
				// (negative lookahead (?!...)).
				"declaration-property-value-disallowed-list": {
					"/^--(?!brand-main$|brand-alt$).*/": [
						"/#[0-9a-fA-F]{3,8}\\b/",
						"/\\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch)(?:\\()/",
						"/^\\s*(red|green|blue|white|black|gray|grey|transparent|navy|teal|cyan|amber)\\s*;?$/",
					],
				},
			},
		},
	],
};
