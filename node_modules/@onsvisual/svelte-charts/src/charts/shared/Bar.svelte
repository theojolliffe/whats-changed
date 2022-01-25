<script>
	import { getContext, createEventDispatcher } from 'svelte';
	
	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

	export let fill = '#00bbff';

	console.log("DATTAA", $data)
</script>

<g class="bar-group">
	{#each $data as d, i}
		<rect
			class='group-rect'
			data-id="{i}"
			x="{$xScale.range()[0]}"
			y="{$yGet(d)}"
			height={20}
			width="{$xGet(d)}"
			{fill}
		></rect>
	{/each}
</g>
