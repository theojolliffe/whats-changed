<script>
	import { getContext, createEventDispatcher } from 'svelte';

	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import DotPlot from './DotPlot.svelte';
	import DotLabels from './DotLabels.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import Legend from './Legend.svelte';
	export let data;
	export let height = 400;
	export let labels = false;
	const yKey = 'label';
	const xKey = Object.keys(data[0]).filter(d => d !== yKey);
	const seriesColors = ['#DF0667', '#3C388E', '#2166ac','#b2182b','grey'];

	data.forEach(d => {
		xKey.forEach(name => {
			d[name] = +d[name];
		});
	});
</script>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>

<div class="chart-container" style="height: {height}px">
	<LayerCake
		padding={{ right: 0, bottom: 20, left: 0 }}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner([0.05]).round(true)}
		yDomain={data.map(d => d[yKey])}
		xPadding={[15, 0]}
		zScale={scaleOrdinal()}
		zDomain={xKey}
		zRange={seriesColors}
		data={data}
	>
		<Svg>
			<AxisX
      />
			<AxisY
				gridlines={false}
			/>
			<DotPlot/>
		</Svg>
		{#if labels}
		<Html>
			<DotLabels/>
		</Html>
		{/if}
	</LayerCake>
</div>
<Legend domain={xKey} colors={seriesColors}/>

