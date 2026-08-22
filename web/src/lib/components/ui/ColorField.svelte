<script lang="ts">
	import Field from './Field.svelte';

	interface Props {
		id: string;
		label: string;
		value?: string;
		hint?: string;
	}

	let { id, label, value = $bindable('#000000'), hint }: Props = $props();
</script>

<Field {id} {label} {hint}>
	<input id={id} class="control swatch" type="color" bind:value />
</Field>

<style>
	.swatch {
		height: var(--control-height);
		width: 3.5rem;
		padding: 2px;
		cursor: pointer;
	}
</style>
