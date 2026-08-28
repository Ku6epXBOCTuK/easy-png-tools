export type ErrorVars = Record<string, string | number>;

/**
 * Ошибка с стабильным ключом перевода вместо готового текста.
 * Ядро бросает только её; человекочитаемый текст подставляет слой UI
 * по секции errors активной локали.
 */
export class ToolError extends Error {
	readonly key: string;
	readonly vars?: ErrorVars;

	constructor(key: string, vars?: ErrorVars) {
		super(key);
		this.name = "ToolError";
		this.key = key;
		this.vars = vars;
	}
}
