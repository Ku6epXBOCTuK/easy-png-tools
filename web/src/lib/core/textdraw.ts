export type Position9 =
	| "top-left"
	| "top-center"
	| "top-right"
	| "middle-left"
	| "center"
	| "middle-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

/**
 * Левый верхний угол контента размером contentW×contentH при размещении
 * на холсте cw×ch с отступом margin согласно 9-позиционной сетке.
 */
export function anchorOrigin(
	position: Position9,
	contentW: number,
	contentH: number,
	cw: number,
	ch: number,
	margin: number,
): { x: number; y: number } {
	const h = position.endsWith("-left")
		? "left"
		: position.endsWith("-right")
			? "right"
			: "center";
	const v = position.startsWith("top-")
		? "top"
		: position.startsWith("bottom-")
			? "bottom"
			: "middle";
	const x =
		h === "left"
			? margin
			: h === "right"
				? cw - margin - contentW
				: (cw - contentW) / 2;
	const y =
		v === "top"
			? margin
			: v === "bottom"
				? ch - margin - contentH
				: (ch - contentH) / 2;
	return { x, y };
}

/**
 * Жадный перенос текста по словам под ширину maxWidth.
 * measure — инъекция измерителя ширины строки. Пустой текст → пустой массив строк.
 */
export function wrapText(
	text: string,
	maxWidth: number,
	measure: (line: string) => number,
): string[] {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((w) => w.length > 0);
	if (words.length === 0) return [];
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const candidate = current.length === 0 ? word : `${current} ${word}`;
		if (measure(candidate) <= maxWidth || current.length === 0) {
			current = candidate;
		} else {
			lines.push(current);
			current = word;
		}
	}
	if (current.length > 0) lines.push(current);
	return lines;
}

export type TilePoint = { x: number; y: number };

const MAX_TILES = 2500;

/**
 * Сетка позиций плитки водяного знака в повернутой системе координат:
 * рисующий код один раз поворачивает контекст и ставит блоки в этих точках.
 * Шаги автоматически увеличиваются, если расчетное количество плиток
 * превышает кап — большие холсты не подвешивают страницу.
 */
export function tileGrid(
	cw: number,
	ch: number,
	angleDeg: number,
	stepX: number,
	stepY: number,
	blockW: number,
	blockH: number,
): TilePoint[] {
	const diag = Math.sqrt(cw * cw + ch * ch);
	const spanX = diag + blockW;
	const spanY = diag + blockH;

	let sx = Math.max(stepX, 1);
	let sy = Math.max(stepY, 1);
	for (let guard = 0; guard < 16; guard++) {
		const count = Math.ceil(spanX / sx) * Math.ceil(spanY / sy);
		if (count <= MAX_TILES) break;
		const factor = Math.sqrt(count / MAX_TILES) * 1.02;
		sx *= factor;
		sy *= factor;
	}

	const cols = Math.max(1, Math.ceil(spanX / sx));
	const rows = Math.max(1, Math.ceil(spanY / sy));
	const startX = -spanX / 2 + (spanX - (cols - 1) * sx) / 2;
	const startY = -spanY / 2 + (spanY - (rows - 1) * sy) / 2;

	const points: TilePoint[] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			points.push({
				x: startX + c * sx - cw / 2,
				y: startY + r * sy - ch / 2,
			});
		}
	}
	return points;
}
