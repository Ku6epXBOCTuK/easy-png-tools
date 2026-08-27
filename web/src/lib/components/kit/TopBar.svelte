<script lang="ts">
	import IconButton from "./IconButton.svelte";
	import Segmented from "./Segmented.svelte";
	import StatusDot from "./StatusDot.svelte";
	import { CircleHelp, Moon, Sun } from "@lucide/svelte";

	interface Props {
		theme: "light" | "dark";
		ontoggle: () => void;
	}

	let { theme, ontoggle }: Props = $props();

	let lang = $state("RU");
</script>

<header class="topbar">
	<div class="brand">
		<span class="brand-mark">EP</span>
		<span>easy-png-tools</span>
	</div>
	<div class="top-actions">
		<span class="status"><StatusDot /> AUTO PIPELINE</span>
		<IconButton icon={CircleHelp} label="Help" onclick={() => {}} />
		<IconButton
			icon={theme === "light" ? Moon : Sun}
			label="Toggle theme"
			onclick={ontoggle}
		/>
		<Segmented
			bind:value={lang}
			options={[
				{ value: "RU", label: "RU" },
				{ value: "EN", label: "EN" },
			]}
		/>
	</div>
</header>

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		padding: 0 clamp(20px, 4vw, 64px);
		background: var(--panel);
		border-bottom: 1px solid var(--line);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font: 600 14px var(--font-mono);
	}
	.brand-mark {
		background: var(--blue);
		color: #fff;
		width: 30px;
		height: 30px;
		font-size: 11px;
		display: grid;
		place-items: center;
	}
	.top-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--muted);
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
	}
</style>
