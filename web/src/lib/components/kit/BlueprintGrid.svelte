<div class="blueprint-grid" aria-hidden="true"></div>

<style>
	.blueprint-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--line) 45%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--line) 45%, transparent) 1px,
				transparent 1px
			);
		background-size: 32px 32px;
		opacity: 0.55;
	}
</style>
