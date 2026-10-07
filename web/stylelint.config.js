// Stylelint config: design-token enforcement for easy-png-tools.
// FWHM: keeps the design system a single source of truth. Colors and sizes must
// come from prefixed tokens; direct color values are allowed only for the two
// brand tokens.

export default {
	extends: ["stylelint-config-standard"],
	ignoreFiles: [
		"**/node_modules/**",
		"**/build/**",
		"**/.svelte-kit/**",
		"**/static/**",
	],
	rules: {
		// Every CSS variable must carry a system prefix so the design
		// vocabulary stays a single greppable source of truth; the two brand
		// tokens are the only exceptions. NOTE: stylelint tests the pattern
		// WITHOUT the leading "--", so the regex must not start with --.
		"custom-property-pattern": [
			"^(brand-main|brand-alt)$|^(color|space|size|text|radius|bp|font|duration|ease|z)-",
			{
				message:
					'"%s" must be prefixed: --color-*, --space-*, --size-*, --text-*, --radius-*, --bp-*, --font-*, --duration-*, --ease-*, --z-*; brand: only --brand-main/--brand-alt',
			},
		],
		// Rule: !important is banned in CSS files. Overriding a look must happen
		// through tokens/layers, not by force. (Not part of the standard set.)
		"declaration-no-important": true,
		// Grouping whitespace for the token file. The standard config puts
		// "after-custom-property" into `except`, which makes --fix DELETE blank
		// lines between consecutive custom properties, collapsing token groups
		// into one wall. `ignore` keeps groups readable.
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
