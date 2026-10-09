export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function clampInt(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function clamp01(value: number): number {
	return clamp(value, 0, 1);
}

export function clampByte(value: number): number {
	return value < 0 ? 0 : value > 255 ? 255 : Math.round(value);
}
