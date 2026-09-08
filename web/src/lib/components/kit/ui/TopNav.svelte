<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<nav class="nav">
	<a href={resolve("/preview/list-tools")}>Catalog</a>
	<a href={resolve("/preview/tools/linear-gradient-png")}>Gradient</a>
	<a href={resolve("/preview/tools/remove-background-png")}>
		Background remover
	</a>
	<a href={resolve("/preview/kit")}> UI Kit </a>
</nav>

<style>
	.nav {
		display: flex;
		align-items: center;
		gap: var(--space-xxl);
		margin-right: var(--space-xxxl);
		margin-left: auto;
	}
	.nav a {
		color: var(--color-text);
		font: bold var(--font-size-s) var(--font-mono);
		white-space: nowrap;
		text-decoration: none;
	}
	.nav a:hover {
		color: var(--color-main);
	}
</style>
