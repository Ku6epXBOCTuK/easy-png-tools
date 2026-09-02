<script lang="ts">
	// TODO: insert version from package.json
</script>

<footer class="preview-footer">
	<span>easy-png-tools <b class="version">v0.1.0</b></span>
	<span>© 2026</span>
</footer>

<style>
	.preview-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xl);
		border-top: var(--size-border) solid var(--color-border);
		font: var(--font-text) var(--font-mono);
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
