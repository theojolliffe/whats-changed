<script>
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

    export let hovered = null;

    let hov
    function doHover(e, d) {
        console.log('e', e)
        console.log('d', d)
        // hovered = d ? d : null;
        hov = d
        dispatch('hover', {
            // id: hovered,
            data: d,
            event: e
        });
	}
    $: console.log('label', hovered) 
</script>

<g class="bar-group">
	{#each $data as e, j}
        {#each e as d, i}
            <rect
                class='group-rect'
                data-id="{i}"
                x="{$xScale.range()[0]}"
                y="{(j % 2 == 0)? $yGet(d) : $yGet(d) + 14 }"
                rx="{5}"
                height={$yScale.bandwidth()/2.5}
                width="{$xGet(d)}"
                fill = "{(j % 2 == 0)? '#3C388E' : '#DF0667' }"
                stroke="{d == hov ? 'orange' : 'white' }"
                stroke-width= "2"
                on:mouseover={el => doHover(el, d)}
                on:mouseleave={e => doHover(e, null)}
            ></rect>
        {/each}
    {/each}
</g>