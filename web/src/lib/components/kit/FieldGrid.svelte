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
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.controls.compact {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	@media (max-width: 800px) {
		.controls.compact {
			grid-template-columns: 1fr;
		}
	}
</style>
