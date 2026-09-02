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
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--foreground);
		cursor: pointer;
	}
	.checkbox-field input {
		accent-color: var(--blue);
	}
</style>
