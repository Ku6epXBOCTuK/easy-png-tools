<script lang="ts">
	import Toggle from "./Toggle.svelte";

	interface Props {
		label: string;
		checked: boolean;
		onchange?: (checked: boolean) => void;
	}

	let { label, checked = $bindable(), onchange }: Props = $props();
</script>

<label class="toggle-row">
	<span>{label}</span>
	<Toggle bind:checked {onchange} {label} />
</label>

<style>
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		color: var(--foreground);
		font-size: 0.85rem;
		cursor: pointer;
	}
</style>
