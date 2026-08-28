<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		compact?: boolean;
		children: Snippet;
	}

	let { compact = false, children }: Props = $props();
</script>

<div class="field-grid" class:compact>
	{@render children()}
</div>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr 1.2fr;
		gap: 16px;
	}
	.field-grid.compact {
		grid-template-columns: 1fr 1fr;
	}
	@media (max-width: 800px) {
		.field-grid,
		.field-grid.compact {
			grid-template-columns: 1fr;
		}
	}
</style>
