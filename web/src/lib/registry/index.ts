import { alphaEntries } from "./alpha";
import { analyzeEntries } from "./analyze";
import { colorEntries } from "./color";
import { convertEntries } from "./convert";
import { filtersEntries } from "./filters";
import { generateEntries } from "./generate";
import { geometryEntries } from "./geometry";
import { textEntries } from "./text";
import type { ToolEntry } from "./types";

export {
	genTool,
	imgTool,
	INPUT_MODES,
	requireSource,
	requireText,
	RESULT_KINDS,
	textGen,
} from "./types";
export type {
	FileResult,
	InputMode,
	ResultKind,
	ToolContext,
	ToolEntry,
	ToolImageFile,
	ToolResult,
	VerdictResult,
} from "./types";

export const TOOLS: ToolEntry[] = [
	...geometryEntries,
	...alphaEntries,
	...convertEntries,
	...analyzeEntries,
	...filtersEntries,
	...colorEntries,
	...generateEntries,
	...textEntries,
] as unknown as ToolEntry[];

export function getTool(id: string): ToolEntry | undefined {
	return TOOLS.find((tool) => tool.id === id);
}
