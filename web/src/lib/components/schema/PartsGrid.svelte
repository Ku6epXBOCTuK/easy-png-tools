<script lang="ts">
	import { cachedDataUrl } from "$lib/core/io";
	import type { ToolImageFile } from "$lib/registry";

	interface Props {
		files: ToolImageFile[];
	}
	let { files }: Props = $props();

	const parts = $derived(
		files.map((file) => ({ name: file.name, url: cachedDataUrl(file.image) })),
	);
</script>

<div class="parts-wrap">
	<div class="parts-grid">
		{#each parts as part (part.name)}
			<figure class="part">
				<img src={part.url} alt={part.name} loading="lazy" />
				<figcaption>{part.name}</figcaption>
			</figure>
		{/each}
	</div>
</div>

<style>
	/* Own scrollbox: usable inside any tile without extra canvas classes. */
	.parts-wrap {
		width: 100%;
		max-height: 60vh;
		overflow: auto;
		align-self: flex-start;
	}
	.parts-grid {
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(var(--size-parts-grid-min), 1fr)
		);
		gap: var(--space-m);
		width: 100%;
		padding: var(--space-l);
		box-sizing: border-box;
		align-content: start;
	}
	.part {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}
	.part img {
		width: 100%;
		height: auto;
		display: block;
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-s);
		background: repeating-conic-gradient(
				var(--color-checker-main) 0 25%,
				var(--color-checker-alt) 0 50%
			)
			50% / 16px 16px;
	}
	.part figcaption {
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		text-align: center;
		overflow-wrap: anywhere;
	}
</style>
