<script lang="ts">
	interface Props {
		label: string;
		checked: boolean;
		onchange?: (checked: boolean) => void;
	}
	let { label, checked = $bindable(), onchange }: Props = $props();

	function handle(e: Event) {
		checked = (e.target as HTMLInputElement).checked;
		onchange?.(checked);
	}
</script>

<label class="checkbox-field">
	<input type="checkbox" {checked} onchange={handle} />
	<span class="checkbox-label">{label}</span>
</label>

<style>
	.checkbox-field {
		display: inline-flex;
		align-items: center;
		gap: var(--space-m);
		font-size: var(--font-size-m);
		color: var(--color-text);
		cursor: pointer;
	}
	.checkbox-field input {
		accent-color: var(--color-main);
	}
</style>
