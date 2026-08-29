<script lang="ts">
	interface Props {
		total: number;
	}
	let { total }: Props = $props();
</script>

<div class="catalog-head">
	<div>
		<div class="eyebrow">EASY-PNG-TOOLS / CATALOG</div>
		<h1>Tool catalog</h1>
		<p>
			Focused utilities for working with PNG. Inspect, transform, and export —
			locally in your browser.
		</p>
	</div>
	<div class="catalog-total">
		<b>{total}</b>
		<span>TOOLS<br /> AVAILABLE</span>
	</div>
</div>

<style>
	.catalog-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.eyebrow {
		font: 12px var(--font-mono);
		letter-spacing: 0.18em;
		color: var(--muted);
		margin-bottom: 0.5rem;
	}
	h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: var(--foreground);
	}
	p {
		margin: 0.5rem 0 0;
		max-width: 56ch;
		color: var(--muted);
		font-size: 0.95rem;
	}
	.catalog-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		line-height: 1;
	}
	.catalog-total b {
		font: 700 2rem var(--font-mono);
		color: var(--foreground);
	}
	.catalog-total span {
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--muted);
		text-align: right;
		margin-top: 0.35rem;
	}
</style>
