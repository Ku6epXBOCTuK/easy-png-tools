<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import EmptyState from "$lib/components/feedback/EmptyState.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { ButtonVariantDefine } from "$lib/components/ui/define";
	import Seo from "$lib/components/Seo.svelte";
	import ToolPickerButton from "$lib/components/schema/ToolPickerButton.svelte";
	import {
		autoChainName,
		createNamedChain,
		deleteChain,
		listChains,
		renameChain,
		type NamedChain,
	} from "$lib/chains.svelte";
	import { chainStepTitle } from "$lib/i18n/schema-tool-strings";
	import { t } from "$lib/i18n/t";
	import { createChain } from "$lib/pipeline.svelte";
	import { PAGES } from "$lib/registry";
	import { Workflow as PipelineIcon } from "@lucide/svelte";
	import { onMount } from "svelte";

	let chains = $state<NamedChain[]>([]);
	let renamingId = $state("");
	let renameValue = $state("");
	let confirmDeleteId = $state("");

	function refresh() {
		chains = listChains();
	}

	onMount(refresh);

	function useChain(id: string) {
		goto(resolve(`/pipeline?id=${id}`));
	}

	function startRename(chain: NamedChain) {
		renamingId = chain.id;
		renameValue = chain.name;
		confirmDeleteId = "";
	}

	function saveRename() {
		renameChain(renamingId, renameValue);
		renamingId = "";
		refresh();
	}

	function remove(id: string) {
		if (confirmDeleteId !== id) {
			confirmDeleteId = id;
			return;
		}
		deleteChain(id);
		confirmDeleteId = "";
		refresh();
	}

	function addNew(toolId: string) {
		const owner = PAGES.find((p) => p.steps[0].id === toolId);
		if (!owner) return;
		const chain = createNamedChain(autoChainName(), createChain(owner));
		goto(resolve(`/pipeline?id=${chain.id}`));
	}
</script>

<Seo
	title={t("savedChains.pageTitle")}
	description={t("savedChains.metaDescription")}
	path="/chains"
/>

<div class="chains-page">
	<header class="head">
		<h1>{t("savedChains.heading")}</h1>
		<ToolPickerButton label={t("savedChains.newChain")} onadd={addNew} />
	</header>

	{#if chains.length === 0}
		<EmptyState
			title={t("savedChains.heading")}
			description={t("savedChains.empty")}
			icon={PipelineIcon}
		/>
	{:else}
		<ul class="list">
			{#each chains as chain (chain.id)}
				<li class="row">
					<div class="info">
						{#if renamingId === chain.id}
							<input
								class="name-input"
								aria-label={t("savedChains.nameAria")}
								bind:value={renameValue}
								onkeydown={(e) => {
									if (e.key === "Enter") saveRename();
									if (e.key === "Escape") renamingId = "";
								}}
							/>
						{:else}
							<strong class="name">{chain.name}</strong>
						{/if}
						<span class="steps">
							{chain.steps.map((s) => chainStepTitle(s.id)).join(" → ")}
						</span>
					</div>
					<div class="row-actions">
						{#if renamingId === chain.id}
							<Button
								label={t("savedChains.renameSave")}
								variant={ButtonVariantDefine.OUTLINE}
								size="s"
								onclick={saveRename}
							/>
						{:else}
							<Button
								label={t("savedChains.use")}
								variant={ButtonVariantDefine.PRIMARY}
								size="s"
								onclick={() => useChain(chain.id)}
							/>
							<Button
								label={t("savedChains.rename")}
								variant={ButtonVariantDefine.OUTLINE}
								size="s"
								onclick={() => startRename(chain)}
							/>
							<Button
								label={confirmDeleteId === chain.id
									? t("savedChains.confirmDelete")
									: t("savedChains.deleteAction")}
								variant={ButtonVariantDefine.CLEAR}
								size="s"
								onclick={() => remove(chain.id)}
							/>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.chains-page {
		max-width: var(--size-content-max-wide);
		margin: 0 auto;
		padding: var(--space-page-top)
			clamp(var(--space-xxl), 4vw, var(--space-page-bottom))
			var(--space-page-bottom);
		width: 100%;
		flex: 1;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-l);
		margin-bottom: var(--space-xxl);
	}
	.head h1 {
		margin: 0;
		font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-2xl));
		color: var(--color-text);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-m);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-l);
		padding: var(--space-l);
		border: var(--size-border) solid var(--color-border);
		border-radius: var(--radius-m);
		background: var(--color-panel);
	}
	.info {
		display: grid;
		gap: var(--space-s);
		min-width: 0;
	}
	.name {
		color: var(--color-text);
		font-size: var(--font-size-m);
	}
	.name-input {
		padding: var(--space-s) var(--space-m);
		background: var(--color-background);
		border: var(--size-border) solid var(--color-main);
		border-radius: var(--radius-s);
		color: var(--color-text);
		font: var(--font-size-m) var(--font-mono);
	}
	.steps {
		color: var(--color-text-muted);
		font: var(--font-size-s) var(--font-mono);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.row-actions {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		flex-shrink: 0;
	}
	@media (--bp-tablet) {
		.row {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
