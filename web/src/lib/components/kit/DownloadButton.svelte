<script lang="ts">
	import { ArrowDownToLine, Download } from "@lucide/svelte";

	interface Props {
		label: string;
		onclick?: () => void;
	}
	let { label, onclick }: Props = $props();
</script>

<button class="download-btn" type="button" onclick={() => onclick?.()}>
	<Download size={16} />
	{label}
	<ArrowDownToLine size={14} />
</button>

<style>
	.download-btn {
		background: var(--blue);
		color: #fff;
		width: 100%;
		height: 42px;
		font: 11px var(--font-mono);
		border: 0;
		justify-content: center;
		align-items: center;
		gap: 9px;
		margin-top: 18px;
		display: flex;
		white-space: nowrap;
	}
	.download-btn:hover {
		background: color-mix(in srgb, var(--blue) 88%, #000);
	}
</style>
