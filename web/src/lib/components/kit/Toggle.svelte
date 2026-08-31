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
		width: 32px;
		height: 18px;
		border: 1px solid var(--line);
		border-radius: 0;
		background: var(--background);
		cursor: pointer;
		padding: 0;
	}
	.toggle.on {
		background: var(--blue);
		border-color: var(--blue);
	}
	.toggle-knob {
		transition: transform 0.12s ease;
	}
	.toggle.on .toggle-knob {
	}
</style>
