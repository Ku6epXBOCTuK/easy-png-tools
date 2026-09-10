<script lang="ts">
	let lang = $state("RU");

	// TODO: change to sectioned dual buttons
</script>

<div class="lang" role="group" aria-label="Language">
	<button
		type="button"
		class="lang-btn"
		class:active={lang === "RU"}
		onclick={() => (lang = "RU")}
	>
		RU
	</button>
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
		border: var(--size-border) solid var(--color-border);
	}
	.lang-btn {
		border: 0;
		background: transparent;
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		padding: var(--space-s) var(--space-m);
		cursor: pointer;
	}
	.lang-div {
		color: var(--color-text);
		font-family: var(--font-sans);
	}
	.lang-btn.active {
		background: var(--color-text);
		color: var(--color-background);
	}
</style>
