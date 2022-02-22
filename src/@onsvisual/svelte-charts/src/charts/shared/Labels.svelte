<script>
	import { getContext } from 'svelte';
	const { data, xScale, yScale, custom } = getContext('LayerCake');
	export let hovered = null;
	export let placeLabel = null;
	export let selected = null;
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let labelKey = $custom.labelKey;
	// let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	// let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
</script>

{#if $coords.length == $data.length}
<g class="label-group">
	{#if $coords[0] && $coords[0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][idKey])}
		{#if placeLabel == $data[i]['unique']}
		<rect 
		fill="rgba(255,255,255,0.8)"
		x={$xScale(d.x)}
		y={$yScale(d.y)}
		transform="translate(5,-45)"
		width="150" 
		height="50" 
		rx="15" />
		<text
			class="label-bold"
			transform="translate(10,-25)"
			fill="#333"
			x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{placeLabel}
		</text>
		<text
			class="label"
			transform="translate(10,-5)"
			fill="#333"
			x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{Math.round($data[i][labelKey] * 10)/10}
		</text>
		<text
			class="label"
			transform="translate(55,-5)"
			fill={(Math.round($data[i]['change'] * 10)/10<0?"#FF0000":"#228C22")}
			x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{"("+(Math.round($data[i]['change'] * 10)/10<0?"":"+") + Math.round($data[i]['change'] * 10)/10 + ")"}
		</text>
		{/if}
		{/if}
	{/each}
	{:else if $coords[0] && $coords[0][0] && $coords[0][0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][0][idKey])}
		<text
			class="label"
			transform="translate(2,3)"
			filter="url(#bgfill)"
			fill="#333"
			x={$xScale(d[d.length - 1].x)}
			y={$yScale(d[d.length - 1].y)}>
			{$data[i][0][labelKey]}
		</text>
		{/if}
	{/each}
	{/if}
</g>
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
