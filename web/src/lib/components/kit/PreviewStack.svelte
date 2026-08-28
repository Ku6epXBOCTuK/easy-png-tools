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
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}
</style>
