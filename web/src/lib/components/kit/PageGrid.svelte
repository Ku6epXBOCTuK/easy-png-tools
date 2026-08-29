<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		settings: Snippet;
		preview: Snippet;
	}

	let { settings, preview }: Props = $props();
</script>

<div class="ws">
	<section class="ws-settings">{@render settings()}</section>
	{@render preview()}
</div>

<style>
	.ws {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(520px, 0.95fr);
		align-items: start;
		gap: 56px;
		max-width: none;
		margin: auto;
		padding: 60px clamp(24px, 4vw, 72px) 72px;
	}
	.ws-settings {
		min-width: 0;
	}
	@media (max-width: 800px) {
		.ws {
			grid-template-columns: 1fr;
			gap: var(--ws-gap-mobile);
			padding: 36px 16px 48px;
		}
	}
</style>
