<script lang="ts">
	interface Props {
		checked: boolean;
		label?: string;
		onchange?: (checked: boolean) => void;
	}
	let { checked = $bindable(), label, onchange }: Props = $props();

	function handle() {
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	class="toggle"
	class:on={checked}
	role="switch"
	aria-checked={checked}
	aria-label={label}
	onclick={handle}
>
	<i class="toggle-knob"></i>
</button>

<style>
	.toggle {
		position: relative;
		width: var(--space-xxxl);
		height: var(--space-xl);
		border: var(--size-border) solid var(--color-border);
		border-radius: 0;
		background: var(--color-background);
		cursor: pointer;
		padding: 0;
	}
	.toggle.on {
		background: var(--color-main);
		border-color: var(--color-main);
	}
	.toggle-knob {
		transition: transform var(--duration-s) ease;
	}
</style>
