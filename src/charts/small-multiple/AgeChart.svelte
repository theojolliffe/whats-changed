<script>
  import { calcExtents, flatten } from 'layercake';

  import SmallMultipleWrapper from './components/SmallMultipleWrapper.percent-range.svelte';
	import Legend from './components/Legend.svelte';

  export let chartData;
  export let labels;
  export let xTickCal;
  export let xMax;
  export let topics;

  const extentGetters = {
    x: d => d.x,
    y: d => d.y
  };

  const fullExtents = calcExtents(flatten(chartData), extentGetters);

  chartData.sort((a, b) => {
    return b[b.length - 1].y - a[a.length - 1].y;
  });

  let scale = 'individual';

</script>


<div class="group-container">
  {#each chartData as data, i}
    <div class="chart-container">
      <SmallMultipleWrapper
        {data}
        {fullExtents}
        {scale}
        {extentGetters}
        nu = {i}
        {labels}
        {xTickCal}
        {xMax}
        {topics}
      />
    </div>
  {/each}
</div>

<Legend domain={[2001, 2011]} colors={['#DF0667', '#3C388E']}/>


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
    width: 30%;
    height: 100%;
  }
</style>
