<script lang="ts">
	import { isChainable, TOOLS } from "$lib/registry";
	import { LOCALE_TAGS } from "$lib/i18n/dict";
	import { getLocale } from "$lib/i18n/locale.svelte";
	import { normalizeForSearch, scoreDoc } from "$lib/i18n/matching";
	import { t } from "$lib/i18n/t";
	import {
		toolDescription,
		toolSearchDoc,
		toolTitle,
	} from "$lib/i18n/tool-strings";
	import ToolCard from "./ToolCard.svelte";

	interface Props {
		onSelect: (toolId: string) => void;
		/** true — только инструменты, пригодные в шаг цепочки (слот добавления шага). */
		chainableOnly?: boolean;
	}

	let { onSelect, chainableOnly = false }: Props = $props();

	const candidates = $derived(
		chainableOnly ? TOOLS.filter(isChainable) : TOOLS,
	);

	let query = $state("");
	let activeIndex = $state(0);
	let listOpen = $state(false);

	type Match = {
		id: string;
		title: string;
		description: string;
		popularity: number;
		score: number;
	};

	const matches = $derived.by(() => {
		const q = normalizeForSearch(query.trim());
		const found: Match[] = [];
		for (const tool of candidates) {
			const s = scoreDoc(toolSearchDoc(tool), q);
			if (s !== null && s > 0) {
				found.push({
					id: tool.id,
					title: toolTitle(tool),
					description: toolDescription(tool),
					popularity: tool.popularity ?? 50,
					score: s,
				});
			}
		}
		const collator = new Intl.Collator(LOCALE_TAGS[getLocale()]);
		found.sort(
			(a, b) =>
				b.score - a.score ||
				b.popularity - a.popularity ||
				collator.compare(a.title, b.title),
		);
		return found.slice(0, 12);
	});

	function choose(id: string) {
		listOpen = false;
		query = "";
		activeIndex = 0;
		onSelect(id);
	}

	function onKeydown(event: KeyboardEvent) {
		if (!listOpen || matches.length === 0) return;
		if (event.key === "ArrowDown") {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % matches.length;
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + matches.length) % matches.length;
		} else if (event.key === "Enter") {
			event.preventDefault();
			const match = matches[Math.min(activeIndex, matches.length - 1)];
			if (match) choose(match.id);
		} else if (event.key === "Escape") {
			listOpen = false;
		}
	}
</script>

<div class="search">
	<input
		type="search"
		bind:value={query}
		onfocus={() => (listOpen = true)}
		oninput={() => {
			listOpen = true;
			activeIndex = 0;
		}}
		onkeydown={onKeydown}
		placeholder={t("search.placeholder")}
		aria-label={t("search.aria")}
		role="combobox"
		aria-expanded={listOpen}
		aria-controls="tool-search-list"
	/>
	{#if listOpen && query.trim().length > 0 && matches.length === 0}
		<p class="none text-muted">{t("search.nothingFound")}</p>
	{:else if listOpen && matches.length > 0}
		<div id="tool-search-list" class="cards" role="listbox">
			{#each matches as match, index (match.id)}
				<ToolCard
					toolId={match.id}
					title={match.title}
					description={match.description}
					selected={index === activeIndex}
					onActivate={() => choose(match.id)}
					onHover={() => (activeIndex = index)}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search {
		position: relative;
		width: 100%;
		max-width: 36rem;
		margin: 0 auto;
	}

	input {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
		background: var(--surface);
		font-size: var(--text-xl);
		text-align: center;
	}

	input:focus {
		border-color: var(--link);
		outline: none;
	}

	.cards {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% + var(--space-1));
		z-index: 40;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-1);
		margin: 0;
		padding: var(--space-1);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
		box-shadow: var(--shadow-card);
		max-height: 26rem;
		overflow-y: auto;
		text-align: left;
	}

	@media (max-width: 40rem) {
		.cards {
			grid-template-columns: 1fr;
		}
	}

	.none {
		margin: var(--space-1) 0 0;
		text-align: center;
		font-size: var(--text-s);
	}
</style>
