<svelte:options accessors={true} />

<script>
	import { calcExtents, flatten, LayerCake, Svg } from 'layercake';

	import SmallMultipleWrapper from './shared/SmallMultipleWrapper.svelte';

	let dataSeries = [
		[
			{ x: 2018 ,y: 640 ,group: "apples" },
			{ x: 2017 ,y: 320 ,group: "apples" },
			{ x: 2019 ,y: 300 ,group: "apples" },
		],
		[
			{ x: 2018 ,y: 440 ,group: "oranges" },
			{ x: 2017 ,y: 320 ,group: "oranges" },
			{ x: 2019 ,y: 200 ,group: "oranges" },
		],
		[
			{ x: 2018 ,y: 740 ,group: "pears" },
			{ x: 2017 ,y: 420 ,group: "pears" },
			{ x: 2019 ,y: 600 ,group: "pears" },
		],
	]
	
	
	// [
	// 	[
	// 		{ x: 0 ,y: 0.5 }, 
	// 		{ x: 1 ,y: 0.3 },
	// 		{ x: 2 ,y: 0.6 }
	// 	],
	// 	[
	// 		{ x: 0 ,y: 0.3 }, 
	// 		{ x: 1 ,y: 0.8 }, 
	// 		{ x: 2 ,y: 0.7 }
	// 	],
	// 	[
	// 		{ x: 0 ,y: 0.4 }, 
	// 		{ x: 1 ,y: 0.5 }, 
	// 		{ x: 2 ,y: 0.4 }
	// 	],
	// ]



	const extentGetters = {
		x: d => d.x,
		y: d => d.y
	};

	const fullExtents = calcExtents(flatten(dataSeries), extentGetters);

	let scale = 'individual';

</script>

<div class="group-container">
	{#each dataSeries as data}
		<div class="chart-container">
			<SmallMultipleWrapper
				{data}
				{fullExtents}
				{scale}
				{extentGetters}
			/>
		</div>
	{/each}
</div>



<style>
	.group-container {
		height: 300px;
		width: 100%;
	}
	.input-container {
		margin-bottom: 7px;
	}
	label {
		cursor: pointer;
	}
	input {
		margin-right: 7px;
	}
	.chart-container {
		position: relative;
		display: inline-block;
		width: 11%;
		height: 30%;
	}
	
</style>
