

<script>
	import { getContext } from 'svelte';
	import { cubicInOut as easing } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';
	import { stack } from 'd3-shape';
	import { group, flatGroup, sum } from 'd3-array';
	
	import { pivot, getAccessor, pivotWider, first, last } from './utils';
	
	const { data, xGet, xScale, yScale, yRange, rGet, y } = getContext('LayerCake');
	
	export let groupBy; // string[]
	export let stackBy = undefined; // string
	export let offset = stackOffsetNone;
	export let delay = 300;
	
	
	$: grouped = groupBy.length > 1
	$: groupedData = flatGroup($data, ...groupBy.map(getAccessor)/*, getAccessor(stackBy)*/)
	
	$: chartData = groupedData.flatMap((d, i) => {
		const keys = d.slice(0, -1); // all but last item
		const itemData = d.slice(-1)[0];    // last item
		
		const pivotData = pivotWider(itemData, groupBy[0], stackBy, 'value');
		
    const stackKeys = [...new Set(itemData.map(x => x[stackBy]))]
		const stackData = stack()
			.keys(stackKeys)
			.offset(offset)
			(pivotData);
		
		
		return stackData.flatMap(series => {
			return series.flatMap(s => {
				return {
					keys: stackBy ? [...keys, series.key] : keys,
					values: stackBy ? [s[0], s[1]] : [0, sum(itemData, $y)],
					data: itemData[0] // TODO: More than one should use stacks or aggregate values?
				}
			})
		})
	})
	
	$: groupKeys = [...new Set($data.map(x => x[groupBy[1]]))]
	$: x1Scale = scaleBand()
			.domain(groupKeys)
			.range([0, $xScale.bandwidth()])
			.paddingInner(0.05)
	
	$: getDimensions = (item) => {
		return {
			x: $xGet(item.data) + (grouped ? x1Scale(item.keys[1]) : 0),
			y: $yScale(item.values[1]),
			width: grouped ? x1Scale.bandwidth() : $xScale.bandwidth(),
			height: $yScale(item.values[0]) - $yScale(item.values[1]),
		}
	}
	
</script>

<!-- TODO: Pass in top-level groupKey (or slice off of groupKeys) instead of using year directly -->
<g class="column-group">
<!--   {#each chartData as item, i (item.keys.join('-'))} -->
	{#each chartData as item, i (first(item.keys) + '-' + last(item.keys))}
    <Rect
      class='group-rect'
			fill={$rGet(last(item.keys))}
			tweenOptions={{
				x: { easing, delay: grouped ? 0: delay },
				y: { easing, delay: grouped ? delay : 0 },
				width: { easing, delay: grouped ? 0 : delay },
				height: { easing, delay: grouped ? delay : 0 },
			}}
			{...getDimensions(item)}
			{...$$restProps}
    />
	{/each}
</g>

<script context="module">
	import { extent, max } from 'd3-array';
	import { stackOffsetNone, stackOffsetExpand } from 'd3-shape';
	
	import Rect from './Rect.svelte';
	
	export function getGroupExtents(data, keys) {
		const values = data.flatMap(d => keys.map(key => d[key]));
		return extent(values);
	}
	
	export function getStackExtents(data, groupBy, stackBy, offset) {
		const pivotData = pivot(data, groupBy, stackBy, items => sum(items, d => d.value));
		
		const stackKeys = Object.keys(pivotData[0]).filter(d => d !== groupBy);
		const stackData = stack()
  		.offset(offset)
			.keys(stackKeys)
			(pivotData);
		
		return extent(stackData.flat(2));
	}
	
	/**
	 * Function to offset each layer by the maximum of the previous layer
	 *   - see: https://observablehq.com/@mkfreeman/separated-bar-chart
	*/
	export function stackOffsetSeparated(series, order) {
		// TODO: Determine way to pass in as option (curry?)
		const gap = 100;
		
		if (!((n = series.length) > 1)) return;
		
		// Standard series
		for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
			(s0 = s1), (s1 = series[order[i]]);
			let base = max(s0, d => d[1]) + gap; // here is where you calculate the maximum of the previous layer
			for (var j = 0; j < m; ++j) {
				// Set the height based on the data values, shifted up by the previous layer
				let diff = s1[j][1] - s1[j][0];
				s1[j][0] = base;
				s1[j][1] = base + diff;
			}
		}
	}
</script>