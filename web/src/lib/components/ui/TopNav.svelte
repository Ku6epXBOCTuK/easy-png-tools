<script lang="ts">
	import { resolve } from "$app/paths";
	import { t } from "$lib/i18n/t";
</script>

<nav class="nav">
	<a href={resolve("/")}>{t("header.home")}</a>
	<a href={resolve("/list-tools")}>{t("header.catalog")}</a>
	<a href={resolve("/kit")}>{t("header.uiKit")}</a>
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
