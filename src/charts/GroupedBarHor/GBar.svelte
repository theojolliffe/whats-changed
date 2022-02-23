<script>
	import { LayerCake, Svg, flatten } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { format, precisionFixed } from 'd3-format';
	import Legend from './Legend.svelte';
	import Bar, { getGroupExtents, getStackExtents, stackOffsetSeparated } from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	export let data;
	
	let layout = 'grouped';  // grouped, stacked, separated, percent, or groupedstacked
	
	$: options = { groupBy: ['group', 'year'] }
	
	const keyColors = ['#DF0667', '#3C388E'];
	const formatTickY = d => format(layout === 'percent' ? `.0%` : `.${precisionFixed(d)}s`)(d);
	
	$: console.log('dadta nax', Math.max(...data.map(d => d.value)))
	$: extents = {
		y: [0, Math.max(...data.map(d => d.value))] // TODO: Calculate
	}
</script>

<div class="chart-container">
	<LayerCake
		{data}
		{extents}

		x={options.groupBy[0]}
		xScale={scaleBand().paddingInner(0.1)}
		xDomain={data.map(d => d[options.groupBy[0]])}

		y={d => d.value}

		r={d => d}
		rScale={scaleOrdinal()}
		rRange={keyColors}

		padding={{ top: 20, bottom: 20, left: 30 }}
	>
		<Svg>
			<AxisX
				gridlines={false}
			/>
			<AxisY
				ticks={4}
				gridlines={true}
				formatTick={formatTickY}
			/>
			
			<Bar {...options} />
		</Svg>
	</LayerCake>
</div>
<Legend domain={[2011, 2021]} colors={keyColors}/>

<style>
	.chart-container {
		width: 100%;
		height: 300px;
		_background-color: rgba(0,0,0,.1);
	}
</style>
