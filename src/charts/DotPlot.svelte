<script>
	import { getContext } from 'svelte';
	import { scaleOrdinal } from 'd3-scale';

	const { data, xGet, yGet, yScale, zScale, config } = getContext('LayerCake');

	export let r = 7;

	$: midHeight = $yScale.bandwidth() / 2;
</script>

<g class="dot-plot">
	{#each $data as row}
		<g class="dot-row">
			<defs>
				<linearGradient id="myGradient" gradientTransform="rotate(0)">
				<stop offset="5%"  stop-color="#3C388E10" />
				<stop offset="95%" stop-color="#3C388E80" />
				</linearGradient>
			</defs>
			<defs>
				<linearGradient id="myGradientRev" gradientTransform="rotate(0)">
				<stop offset="5%"  stop-color="#3C388E80" />
				<stop offset="95%" stop-color="#3C388E10" />
				</linearGradient>
			</defs>

			<rect
				x="{Math.min(...$xGet(row))}"
				y="{$yGet(row) + midHeight-7}"
				width="{Math.max(...$xGet(row))-Math.min(...$xGet(row))}"
				height="14"
				fill="{(((row[2021])-(row[2011]))>0)?"url('#myGradient')":"url('#myGradientRev')"}"
				opacity="0.85"
			></rect>

			{#each $xGet(row) as circleX, i}
				<circle
					cx="{circleX}"
					cy="{$yGet(row) + midHeight}"
					r="{r}"
					fill="{$zScale($config.x[i])}"
				></circle>
			{/each}
		</g>
	{/each}
</g>

<style>
	circle {
		stroke: none;
	}
</style>
