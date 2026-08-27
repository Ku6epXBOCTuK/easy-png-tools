<script lang="ts">
	import StatusDot from './StatusDot.svelte';
	import MonoLabel from './MonoLabel.svelte';

	interface Props {
		label: string;
	}

	let { label }: Props = $props();
</script>

<span class="status-line">
	<StatusDot />
	<MonoLabel>{label}</MonoLabel>
</span>

<style>
	.status-line {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
</style>
