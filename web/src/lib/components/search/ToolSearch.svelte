<script lang="ts">
	import { isChainable, TOOLS } from '$lib/registry';

	interface Props {
		onSelect: (toolId: string) => void;
	}

	let { onSelect }: Props = $props();

	const candidates = TOOLS.filter(isChainable);

	let query = $state('');
	let activeIndex = $state(0);
	let listOpen = $state(false);

	type Match = { id: string; title: string; description: string; score: number };

	function score(tool: (typeof TOOLS)[number], q: string): number | null {
		if (q.length === 0) return 1;
		const title = tool.title.toLowerCase();
		const id = tool.id.toLowerCase();
		const description = tool.description.toLowerCase();
		if (title.startsWith(q)) return 100;
		const inTitle = title.indexOf(q);
		if (inTitle >= 0) return 80 - Math.min(inTitle, 40);
		const inId = id.indexOf(q);
		if (inId >= 0) return 60 - Math.min(inId, 40);
		if (description.includes(q)) return 30;
		let pos = 0;
		let subScore = 20;
		for (const ch of q) {
			pos = title.indexOf(ch, pos);
			if (pos < 0) {
				subScore = -1;
				break;
			}
			subScore -= 1;
			pos += 1;
		}
		return subScore >= 0 ? subScore : null;
	}

	const matches = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const found: Match[] = [];
		for (const tool of candidates) {
			const s = score(tool, q);
			if (s !== null && s > 0) {
				found.push({ id: tool.id, title: tool.title, description: tool.description, score: s });
			}
		}
		found.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
		return found.slice(0, 12);
	});

	function choose(id: string) {
		listOpen = false;
		query = '';
		activeIndex = 0;
		onSelect(id);
	}

	function onKeydown(event: KeyboardEvent) {
		if (!listOpen || matches.length === 0) return;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % matches.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + matches.length) % matches.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const match = matches[Math.min(activeIndex, matches.length - 1)];
			if (match) choose(match.id);
		} else if (event.key === 'Escape') {
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
		placeholder="Найдите инструмент…"
		aria-label="Поиск инструмента"
		role="combobox"
		aria-expanded={listOpen}
		aria-controls="tool-search-list"
	/>
	{#if listOpen && query.trim().length > 0 && matches.length === 0}
		<p class="none text-muted">Ничего не найдено — попробуйте другое слово.</p>
	{:else if listOpen && matches.length > 0}
		<ul id="tool-search-list" role="listbox">
			{#each matches as match, index (match.id)}
				<li role="option" aria-selected={index === activeIndex}>
					<button
						type="button"
						class:selected={index === activeIndex}
						onclick={() => choose(match.id)}
						onmousemove={() => (activeIndex = index)}
					>
						<span class="title">{match.title}</span>
						<span class="hint text-caption text-muted">{match.description}</span>
					</button>
				</li>
			{/each}
		</ul>
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
		border-color: var(--accent);
		outline: none;
	}

	ul {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% + var(--space-1));
		z-index: 40;
		list-style: none;
		margin: 0;
		padding: var(--space-1);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-m);
		box-shadow: var(--shadow-card);
		max-height: 24rem;
		overflow-y: auto;
		text-align: left;
	}

	li button {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		text-align: left;
		padding: var(--space-2);
		border: 0;
		border-radius: var(--radius-s);
		background: none;
		color: inherit;
		cursor: pointer;
	}

	li button.selected,
	li button:hover {
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
	}

	.title {
		font-weight: 600;
		font-size: var(--text-m);
	}

	.hint {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.none {
		margin: var(--space-1) 0 0;
		text-align: center;
		font-size: var(--text-s);
	}
</style>
