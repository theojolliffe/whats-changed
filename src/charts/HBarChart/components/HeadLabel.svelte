<script>
	import { getContext } from 'svelte';
    export let labels;
    export let nu;

        const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');


        let thisLabel = labels[nu].split(" ")
</script>

  
<!-- <g transform='translate({0},{-20})'>

        {#each thisLabel as word}

            <text>

                    {word + " "}

            </text>

        {/each}

</g> -->

<rect x="0" y="0" width="140" height="20" fill="none"/>

<foreignObject x="5" y="-50" width="100" height="40">
    <div style="position: absolute; bottom: 0;">
        {labels[nu]}
    </div>
</foreignObject>



<style>
    text {
      font-size: 14px;
    }
    div {
        font-size: 14px;
        line-height: 1.4;
    }
</style>