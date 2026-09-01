<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		settings: Snippet;
		preview: Snippet;
	}

	let { settings, preview }: Props = $props();
</script>

<div class="page-grid">
	<section class="ws-settings">{@render settings()}</section>
	{@render preview()}
</div>

<style>
	.page-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(calc(50% - 28px), 1fr));
		align-items: start;
		gap: 56px;
		width: 100%;
		max-width: none;
		margin: auto;
		padding: 60px clamp(24px, 4vw, 72px) 72px;
	}
	.ws-settings {
		min-width: 0;
	}
	@media (max-width: 800px) {
		.page-grid {
			grid-template-columns: 1fr;
			gap: var(--ws-gap-mobile);
			padding: 36px 16px 48px;
		}
	}
</style>
