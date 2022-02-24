<script>
	import { getContext } from 'svelte';
	const { data, xScale, yScale, xDomain, y, xGet, yGet, Domain, custom } = getContext('LayerCake');
	export let hovered = null;
	export let ageLabel = null;

</script>

{#if ageLabel.detail}
{#if ageLabel.detail.data}
<g class="label-group">
	<rect 
	fill="rgba(255,255,255,0.9)"
	x={-20}
	y={$yGet(ageLabel.detail.data) + ((ageLabel.detail.data.g==2021)?10:0) - 10}
	transform="translate(5,-25)"
	width="270" 
	height="25" 
	rx="15" />

	<text
		class="label-bold"
		transform="translate(0,-7)"
		fill="#333"
		x={10}
		y={$yGet(ageLabel.detail.data) + ((ageLabel.detail.data.g==2021)?10:0) - 10}>
		{ageLabel.detail.data.x +": " + Math.round(ageLabel.detail.data.y*10)/10 + "%"}
	</text>
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
