import type { PixelImage } from "$lib/core/types";
import {
	createStep,
	insertStep,
	moveStep,
	removeStep,
	type ChainStep,
} from "$lib/pipeline.svelte";
import { getTool } from "$lib/registry";
import {
	clampSourceAwareMaxes,
	defaultSchemaParams,
	withAspectLock,
	type Dimension,
	type ToolSchema,
} from "$lib/registry-schema";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

export interface SchemaToolStateCtx {
	source: () => PixelImage | null;
	stepDims: () => (Dimension | undefined)[];
	clearResults: () => void;
}

interface StepsState {
	steps: ChainStep[];
	dragFrom: number | null;
}

export function toolSchemaOf(step: ChainStep) {
	return getTool(step.id)?.schema as ToolSchema<Record<string, unknown>>;
}

function setStepValue(
	s: StepsState,
	marks: Marks,
	ctx: SchemaToolStateCtx,
	index: number,
	id: string,
	value: unknown,
	axis?: "width" | "height" | "both",
) {
	const step = s.steps[index];
	if (!step) return;
	touchedFor(marks, step.key).add(id);
	const axisKey = `${step.key}:${id}`;
	if (axis) marks.lastAxis[axisKey] = axis === "both" ? "width" : axis;
	const next: Record<string, unknown> = { ...step.params, [id]: value };
	const stepSchema = toolSchemaOf(step);
	const spec = stepSchema?.fields[id]?.spec;
	// Aspect derives from the step input: source for the first step,
	// previous step's result for the rest (dims known after the run).
	const dims =
		index === 0 ? (ctx.source() ?? undefined) : ctx.stepDims()[index - 1];
	if (dims && stepSchema && spec) {
		const aspect = dims.width / dims.height;
		if (
			spec.kind === "dimension" &&
			spec.lockAspectWith &&
			axis !== "both" &&
			next[spec.lockAspectWith] === true
		) {
			next[id] = withAspectLock(
				value as Dimension,
				marks.lastAxis[axisKey] ?? "width",
				aspect,
			);
		} else if (spec.kind === "checkbox" && value === true) {
			// lockAspect just enabled: snap bound fields to the aspect at once.
			for (const [fid, f] of Object.entries(stepSchema.fields)) {
				const fs = f.spec;
				if (fs.kind === "dimension" && fs.lockAspectWith === id) {
					next[fid] = withAspectLock(
						next[fid] as Dimension,
						marks.lastAxis[`${step.key}:${fid}`] ?? "width",
						aspect,
					);
				}
			}
		}
	}
	const clamped = dims ? clampSourceAwareMaxes(stepSchema, next, dims) : next;
	s.steps = s.steps.with(index, { ...step, params: clamped });
}

function resetStep(
	s: StepsState,
	marks: Marks,
	ctx: SchemaToolStateCtx,
	index: number,
) {
	const step = s.steps[index];
	if (!step) return;
	touchedFor(marks, step.key).clear();
	const stepSchema = toolSchemaOf(step);
	const dims =
		index === 0 ? (ctx.source() ?? undefined) : ctx.stepDims()[index - 1];
	const params = stepSchema
		? defaultSchemaParams(stepSchema, { source: dims })
		: {};
	s.steps = s.steps.with(index, { ...step, params });
	ctx.clearResults();
}

interface Marks {
	// Fields edited by the user (per step): on new file load they must not be
	// overwritten by source defaults. Step reset clears the mark.
	touchedByStep: SvelteMap<string, SvelteSet<string>>;
	// Last edited axis of a dimension field; leads under lockAspect.
	lastAxis: Record<string, "width" | "height">;
}

function touchedFor(marks: Marks, key: string): SvelteSet<string> {
	let set = marks.touchedByStep.get(key);
	if (!set) {
		set = new SvelteSet();
		marks.touchedByStep.set(key, set);
	}
	return set;
}

// Chain-step state of SchemaToolView: the steps array, per-step edit marks
// and all mutations. Results/execution live in schema-tool-runner.svelte.ts.
export function createSchemaToolState(ctx: SchemaToolStateCtx) {
	const s = $state<StepsState>({ steps: [], dragFrom: null });
	const marks: Marks = {
		touchedByStep: new SvelteMap(),
		lastAxis: {},
	};
	return {
		get steps() {
			return s.steps;
		},
		set steps(v: ChainStep[]) {
			s.steps = v;
		},
		get dragFrom() {
			return s.dragFrom;
		},
		set dragFrom(v: number | null) {
			s.dragFrom = v;
		},
		touchedFor: (key: string) => touchedFor(marks, key),
		// Marks are keyed by step.key from the previous host; keep them and
		// stale keys leak into the new chain's fields.
		clearMarks: () => {
			marks.touchedByStep.clear();
			for (const k of Object.keys(marks.lastAxis)) delete marks.lastAxis[k];
		},
		setStepValue: (
			index: number,
			id: string,
			value: unknown,
			axis?: "width" | "height" | "both",
		) => setStepValue(s, marks, ctx, index, id, value, axis),
		resetStep: (index: number) => resetStep(s, marks, ctx, index),
		addStepAt: (index: number, toolId: string) => {
			s.steps = insertStep(s.steps, index, toolId);
		},
		removeStepAt: (key: string) => {
			s.steps = removeStep(s.steps, key);
		},
		toggleStep: (index: number) => {
			const step = s.steps[index];
			if (!step) return;
			s.steps = s.steps.with(index, {
				...step,
				collapsed: !step.collapsed,
			});
		},
		// In-place tool swap: step key and collapsed state are kept, params
		// become the new tool's defaults, input is recomputed on run.
		replaceStepTool: (index: number, toolId: string) => {
			const step = s.steps[index];
			const next = createStep(toolId);
			if (!step || !next) return;
			touchedFor(marks, step.key).clear();
			s.steps = s.steps.with(index, {
				...next,
				key: step.key,
				collapsed: step.collapsed,
			});
		},
		onStepDrop: (e: DragEvent, to: number) => {
			e.preventDefault();
			if (s.dragFrom !== null) s.steps = moveStep(s.steps, s.dragFrom, to);
			s.dragFrom = null;
		},
	};
}
