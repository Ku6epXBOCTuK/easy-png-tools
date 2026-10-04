export const ButtonVariantDefine = {
	PRIMARY: "primary",
	OUTLINE: "outline",
	ACCENT: "accent",
	DANGER: "danger",
	CLEAR: "clear",
} as const;

export type ButtonVariant =
	(typeof ButtonVariantDefine)[keyof typeof ButtonVariantDefine];

export const ButtonSizeDefine = {
	M: "m",
	S: "s",
} as const;

export type ButtonSize =
	(typeof ButtonSizeDefine)[keyof typeof ButtonSizeDefine];
