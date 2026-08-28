<script lang="ts">
	import { RotateCcw } from "@lucide/svelte";
	import StatusDot from "./StatusDot.svelte";

	interface Props {
		onreset?: () => void;
		note?: string;
	}

	let { onreset, note = "changes are applied automatically" }: Props = $props();
</script>

<div class="pipeline-footer">
	<button class="reset-btn" onclick={() => onreset?.()}>
		<RotateCcw size={14} /> Reset pipeline
	</button>
	<span class="auto-note"><StatusDot /> {note}</span>
</div>

<style>
	.pipeline-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 18px;
	}
	.reset-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--blue);
		background: none;
		border: 0;
		cursor: pointer;
		font-size: 12px;
	}
	.auto-note {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
		font: 11px var(--font-mono);
	}
</style>
