<script lang="ts">
	import { Download, ArrowDownToLine } from "@lucide/svelte";

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
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--blue);
		background: var(--blue);
		color: #fff;
		font: 12px var(--font-mono);
		letter-spacing: 0.04em;
		padding: 9px 14px;
		border-radius: var(--radius);
		cursor: pointer;
	}
	.download-btn:hover {
		background: color-mix(in srgb, var(--blue) 88%, #000);
	}
</style>
