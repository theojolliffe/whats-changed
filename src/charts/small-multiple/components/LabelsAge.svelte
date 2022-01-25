<script>
	import { getContext } from 'svelte';
	const { data, xScale, yScale, xDomain, y, xGet, yGet, Domain, custom } = getContext('LayerCake');
	export let hovered = null;
	export let ageLabel = null;

	$: console.log('ageLabel', ageLabel)
</script>

{#if ageLabel.detail}
{#if ageLabel.detail.data}
<g class="label-group">
	<rect 
	fill="rgba(255,255,255,0.8)"
	x={-10}
	y={$yGet(ageLabel.detail.data) + ((ageLabel.detail.data.g==2021)?14:0) - 5}
	transform="translate(5,-45)"
	width="150" 
	height="50" 
	rx="15" />
	<!-- <text
		class="label-bold"
		transform="translate(10,-25)"
		fill="#333"
		x={$xScale(d.x)}
		y={$yScale(d.y)}>
		{ageLabel}
	</text>
	<text
		class="label"
		transform="translate(10,-5)"
		fill="#333"
		x={$xScale(d.x)}
		y={$yScale(d.y)}>
		{Math.round($data[i][labelKey] * 10)/10}
	</text> -->
</g>
{/if}
{/if}

<style>
	.label {
		font-size: 0.8em;
	}
	.label-bold {
		font-size: 0.8em;
		font-weight: 600;
	}
</style>
