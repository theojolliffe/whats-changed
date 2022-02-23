<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';
	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import data2 from './groups.js';


	export let data
	$: console.log('data', data)

	$: options = { groupBy: ['group', 'year'] }

	const xKey = 'value';
	const yKey = 'year';

	data2.forEach(d => {
		d[xKey] = +d[xKey];
	});
</script>

<style>
	.chart-container {
		width: 100%;
		height: 300px;
	}
</style>

<div class="chart-container">
	<LayerCake
		padding={{ top: 0, bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner([0.05]).round(true)}
		yDomain={data.map(d => d['group'])}
		xDomain={[0, null]}
		data={data2}
	>
		<Svg>
			<AxisX
				gridlines={true}
				baseline={true}
				snapTicks={true}
			/>
			<AxisY
				gridlines={false}
			/>
			<Bar {...options} />
		</Svg>
	</LayerCake>
</div>
