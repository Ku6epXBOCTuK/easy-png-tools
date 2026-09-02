<script lang="ts">
	import EmptyState from "$lib/components/kit/EmptyState.svelte";
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import SelectField from "$lib/components/kit/SelectField.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import StepCard from "$lib/components/kit/StepCard.svelte";
	import Badge from "$lib/components/kit/ui/Badge.svelte";
	import Button from "$lib/components/kit/ui/Button.svelte";
	import { getTool } from "$lib/registry";
	import ParamControl from "./ParamControl.svelte";

	type ParamValue = string | number | boolean;

	interface ChainStep {
		toolId: string;
		params: Record<string, ParamValue>;
	}

	interface Props {
		steps: ChainStep[];
		chainOptions: { value: string; label: string }[];
		addId: string;
		onAddStep: () => void;
		onSetAddId: (value: string) => void;
		onRemoveStep: (index: number) => void;
		onSetParam: (index: number, id: string, value: ParamValue) => void;
	}

	let {
		steps,
		chainOptions,
		addId,
		onAddStep,
		onSetAddId,
		onRemoveStep,
		onSetParam,
	}: Props = $props();
</script>

<Panel>
	<PanelHeading title="Pipeline" eyebrow="STEPS">
		{#snippet actions()}
			<Badge tone="accent">AUTO</Badge>
		{/snippet}
	</PanelHeading>
	<div class="pipeline-body">
		{#if steps.length === 0}
			<EmptyState title="Pipeline empty" description="Add a tool step below." />
		{/if}
		{#each steps as step, i (step.toolId + i)}
			{@const st = getTool(step.toolId)}
			<StepCard
				index={i + 1}
				title={st?.title ?? step.toolId}
				type={st?.category}
				onremove={() => onRemoveStep(i)}
			>
				{#if st}
					<div class="step-controls">
						{#each st.params as p (p.id)}
							<ParamControl
								param={p}
								value={step.params[p.id]}
								onInput={(v) => onSetParam(i, p.id, v)}
							/>
						{/each}
					</div>
				{/if}
			</StepCard>
		{/each}
	</div>
	<SettingsFooter>
		<div class="add-step">
			<SelectField
				label="Add step"
				value={addId}
				options={chainOptions}
				onchange={(v) => onSetAddId(v)}
			/>
			<Button variant="ghost" onclick={onAddStep}>Add step</Button>
		</div>
	</SettingsFooter>
</Panel>

<style>
	.pipeline-body {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0.75rem;
	}
	.step-controls {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.add-step {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		width: 100%;
	}
	.add-step :global(.select-field),
	.add-step :global(select) {
		min-width: 0;
	}
</style>
