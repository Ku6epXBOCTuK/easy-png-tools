<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		settings: Snippet;
		preview: Snippet;
		columns?: string;
		gap?: string;
		padding?: string;
		maxWidth?: string;
		stickyTop?: string;
		padMobile?: string;
		gapMobile?: string;
	}

	let {
		settings,
		preview,
		columns = "minmax(0, 1fr) minmax(0, 1.1fr)",
		gap = "40px",
		padding = "48px clamp(24px, 4vw, 72px) 72px",
		maxWidth = "1680px",
		stickyTop = "84px",
		padMobile = "32px 16px 48px",
		gapMobile = "24px",
	}: Props = $props();
</script>

<div
	class="ws"
	style="--ws-cols:{columns};--ws-gap:{gap};--ws-pad:{padding};--ws-max:{maxWidth};--ws-sticky:{stickyTop};--ws-pad-mobile:{padMobile};--ws-gap-mobile:{gapMobile};"
>
	<div class="ws-settings">{@render settings()}</div>
	<div class="ws-preview">{@render preview()}</div>
</div>

<style>
	.ws {
		display: grid;
		grid-template-columns: var(--ws-cols);
		align-items: start;
		gap: var(--ws-gap);
		max-width: var(--ws-max);
		margin: auto;
		padding: var(--ws-pad);
	}
	.ws-settings {
		min-width: 0;
	}
	.ws-preview {
		position: sticky;
		top: var(--ws-sticky);
		min-width: 0;
	}
	@media (max-width: 800px) {
		.ws {
			grid-template-columns: 1fr;
			gap: var(--ws-gap-mobile);
			padding: var(--ws-pad-mobile);
		}
		.ws-preview {
			position: static;
		}
	}
</style>
