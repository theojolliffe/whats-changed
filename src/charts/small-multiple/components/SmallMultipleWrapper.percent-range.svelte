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
  export let xTickCal;
  export let topics;
  export let xMax;

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
  $: yDom = data[0].map(d => d.x)
  $: if (yDom[0]) {
    yDom = yDom.reverse()
  }

</script>

<LayerCake
  ssr={true}
  padding={{ top: 40, right: 6, bottom: 2, left: 60 }}
  x={'y'}
  y={'x'}
  data={data}
  xScale={scaleLinear()}
  yScale={scaleBand().paddingInner([0.05]).round(true)}
  xDomain={[0, xMax+1]}
  yDomain={yDom}
  height={300}
>
<!-- <SetCoords/> -->
  <Svg>
    <HeadLabel {labels} {nu}/>
    <AxisY {nu} {topics}/>
    <AxisX {xTickCal}/>
    <Bar on:hover={doHoverAge} />
    <LabelsAge {hovered} {ageLabel} {topics}/>
  </Svg>
</LayerCake>

