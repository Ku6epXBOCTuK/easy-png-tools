export type ErrorVars = Record<string, string | number>;

/**
 * Error with a stable translation key instead of ready-made text.
 * Core throws only this; the UI layer supplies human-readable text
 * from the errors section of the active locale.
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
