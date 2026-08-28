import type { PixelImage } from "./types";
import { createPixelImage } from "./types";

export type ShapeTest = (nx: number, ny: number) => boolean;

/**
 * Координаты теста: нормированные к половине меньшей стороны изображения,
 * центр в (0,0), ось Y вниз как в пикселях.
 */

export function circleTest(radiusFrac: number): ShapeTest {
	return (nx, ny) => Math.hypot(nx, ny) <= radiusFrac;
}

export function boxTest(halfWFrac: number, halfHFrac: number): ShapeTest {
	return (nx, ny) => Math.abs(nx) <= halfWFrac && Math.abs(ny) <= halfHFrac;
}

/** Звезда с points лучами; innerFrac — радиус впадин в долях внешнего радиуса. */
export function starTest(
	points: number,
	innerFrac: number,
	outerFrac: number,
	rotationDeg: number,
): ShapeTest {
	const n = Math.max(3, Math.round(points));
	const rot = (rotationDeg * Math.PI) / 180;
	return (nx, ny) => {
		const theta = Math.atan2(ny, nx) - rot;
		const r = Math.hypot(nx, ny);
		if (r > outerFrac) return false;
		const t = ((theta * n) / (2 * Math.PI)) % 1;
		const tri = Math.abs(t - Math.floor(t + 0.5)) * 2; // 0 на луче, 1 во впадине
		const edge = outerFrac - (outerFrac - innerFrac) * tri;
		return r <= edge;
	};
}

/** Волнистый круг: радиус модулируется синусом с частотой waves. */
export function wavyTest(
	baseFrac: number,
	amplitudeFrac: number,
	waves: number,
	phaseDeg: number,
): ShapeTest {
	const phase = (phaseDeg * Math.PI) / 180;
	return (nx, ny) => {
		const theta = Math.atan2(ny, nx);
		const r = Math.hypot(nx, ny);
		const edge = baseFrac + amplitudeFrac * Math.sin(waves * theta + phase);
		return r <= edge;
	};
}

/**
 * Вырезает фигуру из изображения: внутри фигуры сохраняются исходные пиксели
 * (с их альфой), снаружи альфа обнуляется. Смещение задаётся в долях меньшей стороны.
 */
export function renderShape(
	img: PixelImage,
	test: ShapeTest,
	offsetXFrac = 0,
	offsetYFrac = 0,
): PixelImage {
	const out = createPixelImage(img.width, img.height);
	const minDim = Math.min(img.width, img.height);
	const cx = img.width / 2 + offsetXFrac * minDim;
	const cy = img.height / 2 + offsetYFrac * minDim;
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			const di = (y * img.width + x) * 4;
			if (!test((x + 0.5 - cx) / minDim, (y + 0.5 - cy) / minDim)) continue;
			out.data[di] = img.data[di];
			out.data[di + 1] = img.data[di + 1];
			out.data[di + 2] = img.data[di + 2];
			out.data[di + 3] = img.data[di + 3];
		}
	}
	return out;
}
