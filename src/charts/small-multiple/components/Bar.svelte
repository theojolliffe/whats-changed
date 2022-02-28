<script>
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

    export let hovered = null;

    let hov
    function doHover(e, d) {
        // hovered = d ? d : null;
        hov = d
        dispatch('hover', {
            // id: hovered,
            data: d,
            event: e
        });
	}
</script>

<g class="bar-group">
	{#each $data as e, j}
        {#each e as d, i}
            <rect
                class='group-rect'
                data-id="{i}"
                x="{$xScale.range()[0]}"
                y="{(j % 2 == 0)? $yGet(d) : $yGet(d) + (34.5 - ($data[0].length * 2.5)) }"
                rx="{5}"
                height={$yScale.bandwidth()/2.3}
                width="{$xGet(d)+3}"
                fill = "{(j % 2 == 0)? '#DF0667' : '#3C388E' }"
                stroke="{d == hov ? 'orange' : 'white' }"
                stroke-width= "{d == hov ? '3' : '2' }"
                on:mouseover={el => doHover(el, d)}
                on:mouseleave={e => doHover(e, null)}
            ></rect>
        {/each}
    {/each}
</g>