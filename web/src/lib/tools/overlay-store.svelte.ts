import type { PixelImage } from '$lib/core/types';

/**
 * Картинка-знак для watermark-image-png. Живёт только в состоянии страницы:
 * сознательно не сохраняется в pipeline/localStorage — после восстановления
 * цепочки знак нужно выбрать заново.
 */
let overlay = $state<PixelImage | null>(null);

export function getOverlay(): PixelImage | null {
	return overlay;
}

export function setOverlay(img: PixelImage): void {
	overlay = img;
}

export function clearOverlay(): void {
	overlay = null;
}
