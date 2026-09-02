<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		compact?: boolean;
		children: Snippet;
	}

	let { compact = false, children }: Props = $props();
</script>

<div class="controls" class:compact>
	{@render children()}
</div>

<style>
	.controls {
		display: grid;
		grid-template-columns: 1.1fr 1fr 1.2fr;
		gap: 16px;
	}
	.controls.compact {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	@media (max-width: 800px) {
		.controls,
		.controls.compact {
			grid-auto-flow: row;
			grid-auto-columns: auto;
		}
	}
</style>
