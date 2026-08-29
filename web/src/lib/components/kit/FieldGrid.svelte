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
	/* Реф раскладывает контролы горизонтальным рядом ячеек, каждая с
	   верхней границей-разделителем (≈189px, font-size 16px). */
	.controls {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		gap: 0 24px;
	}
	.controls.compact {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		gap: 0 16px;
	}
	/* Верхняя граница-разделитель на каждой ячейке контрола. */
	.controls > :global(*) {
		border-top: 1px solid var(--line);
		padding-top: 10px;
		min-width: 0;
	}
	@media (max-width: 800px) {
		.controls,
		.controls.compact {
			grid-auto-flow: row;
			grid-auto-columns: auto;
		}
	}
</style>
