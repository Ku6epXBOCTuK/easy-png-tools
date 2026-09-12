<script lang="ts">
	import { t } from "$lib/v1/i18n/t";
	import type { ParamDef, ToolEntry } from "$lib/v1/registry";
	import ParamForm from "../ParamForm.svelte";

	interface Props {
		tool: ToolEntry;
		params: ParamDef[];
		values: Record<string, any>;
		pipetteTargetId?: string | null;
		onPipetteToggle?: (id: string) => void;
		hasMask?: boolean;
		showMask?: boolean;
	}

	let {
		tool,
		params,
		values = $bindable(),
		pipetteTargetId = null,
		onPipetteToggle,
		hasMask = false,
		showMask = $bindable(false),
	}: Props = $props();
</script>

<div class="root">
	{#if params.length > 0 || hasMask}
		<ParamForm
			{tool}
			{params}
			bind:values
			{pipetteTargetId}
			{onPipetteToggle}
			{hasMask}
			bind:showMask
		/>
	{:else}
		<p class="hint text-caption text-muted">{t("paramsCard.noParams")}</p>
	{/if}
</div>

<style>
	.root {
		padding: 0 var(--space-4) var(--space-3);
	}

	.hint {
		margin: 0;
	}
</style>
