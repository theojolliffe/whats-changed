<script>
	import { load } from "archieml"; 
    import Select from "./ui/Select.svelte";

    let el;
    var selected

    var topics;
    fetch("./archie.aml")
        .then((res) => res.text())
        .then((txt) => (topics = load(txt)))

    let topicOptions = [
		{"label": "Average age", "value": "agemed_value_change"},
		// {"label": "Care provision", "value": "care_perc_change"},
		{"label": "Employment status", "value": "economic_perc_change"},
		{"label": "Ethnicity", "value": "ethnicity_perc_change"},
		{"label": "Health", "value": "health_perc_change"},
		{"label": "Hours worked", "value": "hoursworked_perc_change"},
		{"label": "Households with children", "value": "children_perc_change"},
		{"label": "Households by family", "value": "household_perc_change"},
		{"label": "Marital status", "value": "marital_perc_change"},
		{"label": "Population", "value": "population_value_change"},
		{"label": "Religion", "value": "religion_perc_change"},
		{"label": "Tenure", "value": "tenure_perc_change"},
	]

    function loadTopic(value) {
        console.log("topics", topics[value.split("_")[0]])
        console.log("topics", topics)
    }

</script>

<!-- <div>
	<div style="width: 640px; margin: 50px auto;">
		<Select bind:selected options={topicOptions} placeholder="Search a topic" value="value" label="label" search={true} on:select="{() => { if (selected) { loadTopic(selected.value) }}}"/>
	</div>
</div> -->

<iframe width="100%" height="6494" frameborder="0"
  src="https://observablehq.com/embed/cc9449078bb7b9ae?cells=chart"></iframe>

<style>
	.chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
	}
</style>
