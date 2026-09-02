<script lang="ts">
	let lang = $state("RU");

	// TODO: change to sectioned dual buttons
</script>

<div class="lang" role="group" aria-label="Language">
	<button
		type="button"
		class="lang-btn"
		class:active={lang === "RU"}
		onclick={() => (lang = "RU")}>RU</button
	><span class="lang-div">/</span>
	<button
		type="button"
		class="lang-btn"
		class:active={lang === "EN"}
		onclick={() => (lang = "EN")}>EN</button
	>
</div>

<style>
	.lang {
		display: flex;
		align-items: center;
		border: 1px solid var(--line);
	}
	.lang-btn {
		border: 0;
		background: transparent;
		color: var(--muted);
		font: 10px var(--font-mono);
		padding: 6px 9px;
		cursor: pointer;
	}
	.lang-div {
		color: var(--foreground);
		font-family: var(--font-sans);
	}
	.lang-btn.active {
		background: var(--foreground);
		color: var(--background);
	}
</style>
