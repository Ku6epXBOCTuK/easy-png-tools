import type { PixelImage } from '../core/types';

type MaybeRunnable = {
	run?: (img: PixelImage, params: Record<string, unknown>) => Promise<PixelImage> | PixelImage;
};

export async function executeStep(
	tool: MaybeRunnable,
	img: PixelImage,
	params: Record<string, unknown>
): Promise<PixelImage> {
	if (!tool.run) {
		throw new Error('Этот инструмент не обрабатывает изображения');
	}
	return await tool.run(img, params);
}
