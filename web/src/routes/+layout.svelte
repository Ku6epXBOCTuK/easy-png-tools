<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { CATEGORIES } from '$lib/categories';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header>
		<a href="/" class="brand">easy-png-tools</a>
		<nav aria-label="Категории инструментов">
			{#each CATEGORIES as category (category.id)}
				<a class="nav-link" href="/#{category.id}">{category.label}</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p class="text-caption text-muted">
			Все операции выполняются локально в вашем браузере — файлы никуда не отправляются.
		</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		flex-wrap: wrap;
		padding: var(--space-3) var(--space-4);
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--text);
	}

	.brand:hover {
		text-decoration: none;
		color: var(--accent);
	}

	nav {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.nav-link {
		color: var(--text-muted);
		font-size: var(--text-s);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-s);
	}

	.nav-link:hover {
		color: var(--accent);
		background: var(--bg);
		text-decoration: none;
	}

	main {
		flex: 1;
		width: 100%;
		padding: var(--space-4) var(--space-5);
	}

	footer {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--border);
		text-align: center;
	}
</style>
