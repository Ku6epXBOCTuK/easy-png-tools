import type { PixelImage } from "$lib/core/types";
import type { ChainStep } from "$lib/pipeline.svelte";
import { getTool } from "$lib/registry";
import { sanitizeSchemaParams } from "$lib/registry-schema";
import { SvelteSet } from "svelte/reactivity";
import { toolSchemaOf } from "./schema-tool-state.svelte";

export interface StepMasksCtx {
	steps: () => ChainStep[];
	source: () => PixelImage | null;
	stepResults: () => (PixelImage | null)[];
}

// Per-step mask preview of SchemaToolView: the toggle lives on every step
// result tile (keyed by step.key), the mask never enters the chain itself.
export function createStepMasks(ctx: StepMasksCtx) {
	const onKeys = new SvelteSet<string>();
	// Recomputed on the main thread per toggled step from that step's input.
	const results = $derived.by(() => {
		const next: Record<string, PixelImage | null> = {};
		ctx.steps().forEach((step, i) => {
			if (!onKeys.has(step.key)) return;
			const stepTool = getTool(step.id);
			if (!stepTool?.runMask) return;
			const input = i === 0 ? ctx.source() : ctx.stepResults()[i - 1];
			if (!input) return;
			// Same contract as executor.ts: params are sanitized against the
			// schema with the step input as the source context.
			const stepSchema = toolSchemaOf(step);
			const params = stepSchema
				? sanitizeSchemaParams(stepSchema, step.params, { source: input })
				: step.params;
			try {
				next[step.key] = stepTool.runMask({ params, source: input });
			} catch {
				next[step.key] = null;
			}
		});
		return next;
	});
	return {
		get maskable() {
			return ctx.steps().map((s) => !!getTool(s.id)?.runMask);
		},
		get maskOn() {
			return ctx.steps().map((s) => onKeys.has(s.key));
		},
		get masks() {
			return ctx.steps().map((s) => results[s.key] ?? null);
		},
		toggleByIndex: (i: number) => {
			const step = ctx.steps()[i];
			if (!step) return;
			if (onKeys.has(step.key)) onKeys.delete(step.key);
			else onKeys.add(step.key);
		},
		clear: () => onKeys.clear(),
	};
}
