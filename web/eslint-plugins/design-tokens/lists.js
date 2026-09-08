// Shared constants for the design-tokens ESLint plugin.
// Single source for property lists and regexes so each rule cooks from the
// same vocabulary.

// =====================================================================
// Properties that accept a COLOR.
// =====================================================================
export const COLOR_PROPS =
	/^(color|background|background-color|background-image|border|border-color|border-top|border-right|border-bottom|border-left|outline|outline-color|box-shadow|text-shadow|fill|stroke|fill-color|stroke-color|stop-color|flood-color|lighting-color|column-rule|column-rule-color|text-decoration|text-decoration-color|caret-color|accent-color|border-top-color|border-right-color|border-bottom-color|border-left-color)$/;

// =====================================================================
// Properties that accept a SIZE (px/rem/em).
// z-index is handled separately (it's an integer, not a length).
// =====================================================================
export const SIZE_PROPS =
	/^(width|height|min-width|max-width|min-height|max-height|padding|padding-top|padding-right|padding-bottom|padding-left|margin|margin-top|margin-right|margin-bottom|margin-left|gap|column-gap|row-gap|top|right|bottom|left|inset|font|font-size|letter-spacing|word-spacing|line-height|border-radius|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius|border-width|border-top-width|border-right-width|border-bottom-width|border-left-width|flex-basis|background-size|background-position|border-spacing|grid-template-columns|grid-template-rows)$/;

// =====================================================================
// SHORTHAND properties that accept BOTH a color and a size. The browser
// assigns their sub-properties by value type at runtime (length -> width,
// color -> ...-color), so they cannot be category-checked positionally.
//      border      -> border-width + border-color
//      outline     -> outline-width + outline-color
//      text-decoration -> text-decoration-line/-color/...
//      column-rule     -> column-rule-width + column-rule-color
// The longhands they expand to (border-width, border-color, ...) are already
// covered individually by SIZE_PROPS / COLOR_PROPS.
// =====================================================================
export const MIXED_PROPS =
	/^(border|border-top|border-right|border-bottom|border-left|outline|text-decoration|column-rule)$/;

// =====================================================================
// Properties that carry a DURATION (ms/s) — transitions/animations.
// =====================================================================
export const DURATION_PROPS =
	/^(transition|transition-duration|transition-delay|animation|animation-duration|animation-delay)$/;

// =====================================================================
// A hardcoded COLOR literal: hex / color functions / named colors.
// Regex legend:
//    - hex:    #[0-9a-fA-F]{3,8}\b  — #fff / #112233 / #1234
//    - funcs:  (rgb|rgba|hsl|hsla|hwb|lab|lch|oklch|oklab)(
//    - names:  common CSS color names on a word boundary
// =====================================================================
export const COLOR_LITERAL =
	/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklch|oklab)\s*\(|(?:^|\s|,|\()(?:white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|lime|teal|cyan|navy|maroon|olive|aqua|fuchsia|gold|indigo|violet|magenta|grey)\b/gi;

// =====================================================================
// A hardcoded SIZE literal (px/rem/em), fractional allowed: 0.5rem.
// =====================================================================
export const FORBIDDEN_SIZE_TOKEN = /\d+(?:\.\d+)?(?:px|rem|em)\b/g;

// =====================================================================
// A hardcoded DURATION literal (ms/s): 200ms, 0.3s.
// =====================================================================
export const FORBIDDEN_DURATION_TOKEN = /\d+(?:\.\d+)?(?:ms|s)\b/g;

// =====================================================================
// Token PREFIXES by category (tests run against the var() name, e.g.
// --color-bg, --brand-main, --space-1, --z-header).
// =====================================================================
export const COLOR_TOKEN = /^--(?:color|brand)-/;
export const SIZE_TOKEN = /^--(?:space|size|text|radius|bp|z)-/;
export const DURATION_TOKEN = /^--(?:duration|ease|motion)-/;
