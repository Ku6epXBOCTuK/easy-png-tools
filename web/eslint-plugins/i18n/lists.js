// Lists shared by the i18n rules.

// Attributes whose string value is shown to a user, so a literal there is
// hardcoded copy. Technical attributes (variant, tone, type, icon, size, role,
// href, id, class, name) are deliberately absent.
export const USER_TEXT_ATTRS = new Set([
	"alt",
	"aria-label",
	"description",
	"emptyText",
	"error",
	"eyebrow",
	"hint",
	"label",
	"placeholder",
	"suffix",
	"title",
	"unit",
]);
