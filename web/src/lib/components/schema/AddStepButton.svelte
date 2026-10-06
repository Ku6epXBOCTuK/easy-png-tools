<script lang="ts">
	import { t } from "$lib/i18n/t";
	import ToolPickerButton from "./ToolPickerButton.svelte";

	interface Props {
		onadd: (toolId: string) => void;
	}
	let { onadd }: Props = $props();
</script>

<div class="add-step">
	<ToolPickerButton label={t("chain.addStep")} {onadd} />
</div>

<style>
	.add-step {
		display: flex;
		justify-content: flex-end;
		margin: var(--space-s) 0;
	}
</style>
