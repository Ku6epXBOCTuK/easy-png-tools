<script lang="ts">
	import type { ParamDef } from '$lib/registry';

	let {
		params,
		values = $bindable()
	}: {
		params: ParamDef[];
		values: Record<string, any>;
	} = $props();
</script>

{#each params as param (param.id)}
	<div class="field">
		{#if param.type === 'checkbox'}
			<label class="checkbox">
				<input type="checkbox" bind:checked={values[param.id]} />
				{param.label}
			</label>
		{:else}
			<label for={param.id}>{param.label}</label>
			{#if param.type === 'number'}
				<input
					id={param.id}
					type="number"
					min={param.min}
					max={param.max}
					step={param.step}
					bind:value={values[param.id]}
				/>
			{:else if param.type === 'select'}
				<select id={param.id} bind:value={values[param.id]}>
					{#each param.options as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if param.type === 'color'}
				<input id={param.id} type="color" bind:value={values[param.id]} />
			{/if}
		{/if}
	</div>
{/each}

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-bottom: var(--space-3);
	}

	label,
	.checkbox {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	input,
	select {
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-s);
		background: var(--surface);
		max-width: 16rem;
	}

	input[type='number'] {
		font-family: var(--font-mono);
	}

	input[type='color'] {
		height: 2.4rem;
		padding: 2px;
		cursor: pointer;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text);
		cursor: pointer;
	}

	.checkbox input {
		width: 1rem;
		height: 1rem;
	}
</style>
