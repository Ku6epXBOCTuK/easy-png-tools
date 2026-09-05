import type { ToolEntry } from "./types";
import { geometryEntries } from "./geometry";
import { alphaEntries } from "./alpha";
import { convertEntries } from "./convert";
import { analyzeEntries } from "./analyze";
import { filtersEntries } from "./filters";
import { colorEntries } from "./color";
import { generateEntries } from "./generate";

export type { ToolEntry } from "./types";

export const TOOLS: ToolEntry[] = [
	...geometryEntries,
	...alphaEntries,
	...convertEntries,
	...analyzeEntries,
	...filtersEntries,
	...colorEntries,
	...generateEntries,
] as unknown as ToolEntry[];

export function getTool(id: string): ToolEntry | undefined {
	return TOOLS.find((tool) => tool.id === id);
}
