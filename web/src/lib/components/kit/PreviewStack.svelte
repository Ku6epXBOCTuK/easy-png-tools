<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		pad?: string;
		children: Snippet;
	}

	let { pad = "0", children }: Props = $props();
</script>

<div class="preview-stack" style="padding:{pad};">
	{@render children()}
</div>

<style>
	.preview-stack {
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		width: 100%;
		min-width: 0;
		display: grid;
	}
	@media (max-width: 1100px) {
		.preview-stack {
			grid-template-columns: repeat(3, minmax(220px, 1fr));
		}
	}
</style>
