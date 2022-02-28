<script>
  import { calcExtents, flatten } from 'layercake';

  import SmallMultipleWrapper from './components/SmallMultipleWrapper.percent-range.svelte';
	import Legend from './components/Legend.svelte';

  export let data;

  export let labels;
  console.log('HB data', data)

  const extentGetters = {
    x: d => d.x,
    y: d => d.y
  };

  const fullExtents = calcExtents(flatten(data), extentGetters);

  data.sort((a, b) => {
    return b[b.length - 1].y - a[a.length - 1].y;
  });

  let scale = 'individual';

</script>


<div class="group-container">
    <div class="chart-container">
      <SmallMultipleWrapper
        data = {data}
        {fullExtents}
        {scale}
        {extentGetters}
        nu = {0}
        {labels}
      />
    </div>
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
    width: 100%;
    height: 100%;
  }
</style>
