export const ButtonVariantDefine = {
	PRIMARY: "primary",
	OUTLINE: "outline",
	ACCENT: "accent",
	DANGER: "danger",
	CLEAR: "clear",
} as const;

export type ButtonVariant =
	(typeof ButtonVariantDefine)[keyof typeof ButtonVariantDefine];
