<script lang="ts">
	import { Download } from "@lucide/svelte";
	import Button from "./Button.svelte";

	interface Props {
		label: string;
		size?: string;
		onclick?: () => void;
	}
	let { label, size, onclick }: Props = $props();
</script>

<Button icon={Download} variant="primary" onclick={() => onclick?.()}>
	{label}{#if size}<span class="dl-size">{size}</span>{/if}
</Button>

<style>
	.dl-size {
		font-family: var(--font-mono);
		font-size: 10px;
		opacity: 0.8;
	}
</style>
