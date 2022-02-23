<script>
  import { LayerCake, Svg, calcExtents } from 'layercake';
	import AxisY from './AxisY.svelte';
	import AxisX from './AxisX.svelte';
	import HeadLabel from './HeadLabel.svelte';
  import LabelsAge from './LabelsAge.svelte';

  import Line from './Line.svelte';

  import Bar from './Bar.svelte';
  import { scaleBand, scaleLinear } from 'd3-scale';

  export let data;
  export let labels;
  export let nu;
  export let fullExtents;
  export let scale;
  export let extentGetters;

  let hovered = null;
  let ageLabel = true;


  const extents = calcExtents(data, extentGetters);


  function doHoverAge(e) {

		hovered = e.detail.id;
    ageLabel = e
		// if (hovered) {
		// 	placeLabel = e.detail.data.unique
		// }
	}
  console.log('data', data[0].map(d=>d.x))

</script>

<LayerCake
  ssr={true}
  padding={{ top: 40, right: 6, bottom: 2, left: 60 }}
  x={'y'}
  y={'x'}
  data={data}
  xScale={scaleLinear()}
  yScale={scaleBand().paddingInner([0.05]).round(true)}
  xDomain={[0, 100]}
  yDomain={data[0].map(d=>d.x).reverse()}
  height={300}
>
<!-- <SetCoords/> -->
  <Svg>
    <AxisY {nu}/>
    <AxisX/>
    <Bar on:hover={doHoverAge} />
    <LabelsAge {hovered} {ageLabel}/>
  </Svg>
</LayerCake>

