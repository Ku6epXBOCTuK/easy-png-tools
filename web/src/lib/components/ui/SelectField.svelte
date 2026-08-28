<script lang="ts">
	import Field from "./Field.svelte";

	interface Props {
		id: string;
		label: string;
		value?: string;
		options: { value: string; label: string }[];
		hint?: string;
	}

	let { id, label, value = $bindable(""), options, hint }: Props = $props();
</script>

<Field {id} {label} {hint}>
	<select {id} class="control" bind:value>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</Field>
