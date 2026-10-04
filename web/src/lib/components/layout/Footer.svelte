<script lang="ts">
	import { version } from "../../../../package.json";

	const versionLabel = `v${version}`;
</script>

<footer class="preview-footer">
	<span>easy-png-tools <b class="version">{versionLabel}</b></span>
	<span>© 2026</span>
</footer>

<style>
	.preview-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xl);
		background: var(--color-background);
		border-top: var(--size-border) solid var(--color-border);
		font: var(--font-size-s) var(--font-mono);
		color: var(--color-text-muted);
		& span {
			display: flex;
			align-items: center;
			gap: var(--space-m);
		}
	}
	.preview-footer .version {
		font-weight: normal;
		color: var(--color-text-accent);
	}
</style>
