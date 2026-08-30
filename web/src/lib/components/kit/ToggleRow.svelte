<script lang="ts">
	import Toggle from "./Toggle.svelte";

	interface Props {
		label: string;
		checked: boolean;
		onchange?: (checked: boolean) => void;
	}

	let { label, checked = $bindable(), onchange }: Props = $props();
</script>

<div class="toggle-row">
	<span>{label}</span>
	<Toggle bind:checked {onchange} {label} />
</div>

<style>
	.toggle-row {
		color: var(--foreground);
		cursor: pointer;
	}
</style>
