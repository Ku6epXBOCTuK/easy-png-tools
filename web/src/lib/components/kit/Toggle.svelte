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
		width: 2.4rem;
		height: 1.3rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--background);
		cursor: pointer;
		padding: 0;
	}
	.toggle.on {
		background: var(--blue);
		border-color: var(--blue);
	}
	.toggle-knob {
		position: absolute;
		top: 1px;
		left: 1px;
		width: calc(1.3rem - 4px);
		height: calc(1.3rem - 4px);
		border-radius: 50%;
		background: var(--foreground);
		transition: transform 0.12s ease;
	}
	.toggle.on .toggle-knob {
		transform: translateX(1.1rem);
		background: #fff;
	}
</style>
