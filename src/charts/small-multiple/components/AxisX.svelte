<script>
	import { getContext } from 'svelte';

	const { data, width, height, xScale, yScale, yRange } = getContext('LayerCake');

	export let gridlines = true;
	export let formatTick = d => d;
	export let baseline = false;
	export let flipped = false;
	export let snapTicks = false;
	export let ticks = undefined;
	export let prefix = '';
	export let suffix = '';
	export let xTick = undefined;
	export let yTick = 15;
	export let dxTick = 0;
	export let dyTick = 0;
	export let lineColor = '#aaa';
	export let textColor = '#666';
	export let solid = false;
	export let xTickCal;
	
	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$xScale.domain() :
			$xScale.ticks(ticks);

	function textAnchor(i) {
		if (snapTicks === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}
	// $: xTickCal = Math.round((Math.max(...$data[0].map(d => d.y))-5)/10)*10
	$: console.log('X data tick', xTickCal)

	
</script>

<g class='axis x-axis'>
<g class='tick' transform='translate({$xScale(xTickCal)},{$height})'>
	<line y1='{($height * -1)}' y2='{($height * -1)+$height}' x1='0' x2='0' stroke='{lineColor}' class:baseline={solid}></line>
	<text
		x="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0 }"
		y='{yTick}'
		dx="{textAnchor(xTickCal) == 'start' ? dxTick - 2 : textAnchor(xTickCal) == 'end' ? dxTick + 2 : dxTick}"
		dy='{dyTick}'
		text-anchor='{textAnchor(xTickCal)}'
		fill='{lineColor}'>
		{xTickCal+"%"}
	</text>
</g>
{#if baseline === true}
		<line class="baseline" y1='{$height}' y2='0' x1='0' x2='0' stroke='{lineColor}'></line>
	{/if}
</g>

<style>
	.tick {
		font-size: 14px;
		font-weight: 200;
	}

	.baseline {
		stroke-dasharray: 0 !important;
	}
</style>