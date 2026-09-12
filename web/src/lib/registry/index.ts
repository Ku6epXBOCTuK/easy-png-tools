import type { ToolEntry } from "./types";
import { geometryEntries } from "./geometry";
import { alphaEntries } from "./alpha";
import { convertEntries } from "./convert";
import { analyzeEntries } from "./analyze";
import { filtersEntries } from "./filters";
import { colorEntries } from "./color";
import { generateEntries } from "./generate";
import { textEntries } from "./text";

export {
	genTool,
	imgTool,
	textGen,
	requireSource,
	requireText,
	INPUT_MODES,
	RESULT_KINDS,
} from "./types";
export type {
	InputMode,
	ResultKind,
	ToolContext,
	ToolEntry,
	ToolResult,
	ToolImageFile,
	FileResult,
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
