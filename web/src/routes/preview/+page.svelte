<script lang="ts">
	import TextField from "$lib/components/kit/fields/TextField.svelte";
	import Panel from "$lib/components/kit/layout/Panel.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import ToolCard from "$lib/components/kit/ToolCard.svelte";
	import Button from "$lib/components/kit/ui/Button.svelte";
	import { TOOLS } from "$lib/registry-new";
	import { Search } from "@lucide/svelte";

	let query = $state("");
	const results = $derived(
		TOOLS.filter((t) =>
			(t.title + " " + t.description)
				.toLowerCase()
				.includes(query.toLowerCase()),
		).slice(0, 24),
	);
</script>

<section class="workspace">
	<header class="ws-head">
		<span class="ws-eyebrow">EASY PNG TOOLS</span>
		<h1 class="ws-title">Workspace</h1>
		<p class="ws-lede">
			Откройте PNG-инструмент, загрузите изображение и получите результат без
			установки и регистрации.
		</p>
	</header>

	<Panel title="Search" eyebrow="tools">
		<div class="ws-search">
			<div class="ws-field">
				<TextField
					label="Search tools"
					bind:value={query}
					placeholder="Search tools…"
				/>
			</div>
			<Button
				icon={Search}
				variant="primary"
				onclick={() => {}}
				label="Search"
			/>
		</div>
		<div class="ws-results">
			{#each results as tool (tool.id)}
				<ToolCard
					title={tool.title}
					id={tool.id}
					description={tool.description}
				/>
			{/each}
		</div>
		<SettingsFooter>
			<Button onclick={() => {}} label="Open last project" />
		</SettingsFooter>
	</Panel>
</section>

<style>
	.workspace {
		max-width: var(--size-content-max);
		margin: 0 auto;
		padding: var(--space-page-top) var(--space-xl) var(--space-page-bottom);
		display: flex;
		flex-direction: column;
		gap: var(--space-xxl);
	}
	.ws-head {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}
	.ws-eyebrow {
		font-family: var(--font-mono);
		font-size: var(--font-size-s);
		letter-spacing: var(--space-text-2xl);
		color: var(--color-text-muted);
	}
	.ws-title {
		margin: 0;
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-text);
	}
	.ws-lede {
		margin: 0;
		max-width: 56ch;
		color: var(--color-text-muted);
		font-size: var(--font-size-l);
	}
	.ws-search {
		display: flex;
		gap: var(--space-m);
		padding: var(--space-l) var(--space-xl);
		align-items: center;
	}
	.ws-field {
		flex: 1;
	}
	.ws-results {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-l);
		padding: var(--space-m) var(--space-xl);
	}
</style>
