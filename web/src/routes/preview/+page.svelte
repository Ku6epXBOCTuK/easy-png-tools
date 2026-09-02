<script lang="ts">
	import Panel from "$lib/components/kit/Panel.svelte";
	import PanelHeading from "$lib/components/kit/PanelHeading.svelte";
	import SettingsFooter from "$lib/components/kit/SettingsFooter.svelte";
	import TextField from "$lib/components/kit/TextField.svelte";
	import ToolCard from "$lib/components/kit/ToolCard.svelte";
	import Button from "$lib/components/kit/ui/Button.svelte";
	import { TOOLS } from "$lib/registry";
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

	<Panel>
		<PanelHeading title="Search" eyebrow="tools" />
		<div class="ws-search">
			<div class="ws-field">
				<TextField
					label="Search tools"
					bind:value={query}
					placeholder="Search tools…"
				/>
			</div>
			<Button icon={Search} variant="primary" onclick={() => {}}>Search</Button>
		</div>
		<div class="ws-results">
			{#each results as tool (tool.id)}
				<ToolCard
					title={tool.title}
					href="/preview/tools/{tool.id}"
					description={tool.description}
				/>
			{/each}
		</div>
		<SettingsFooter>
			<Button onclick={() => {}}>Open last project</Button>
		</SettingsFooter>
	</Panel>
</section>

<style>
	.workspace {
		max-width: 880px;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.ws-head {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.ws-eyebrow {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.18em;
		color: var(--muted);
	}
	.ws-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: var(--foreground);
	}
	.ws-lede {
		margin: 0;
		max-width: 56ch;
		color: var(--muted);
		font-size: 0.95rem;
	}
	.ws-search {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		align-items: center;
	}
	.ws-field {
		flex: 1;
	}
	.ws-results {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.75rem;
		padding: 0.5rem 1rem 1rem;
	}
</style>
