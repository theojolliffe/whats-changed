<script>
	import { getData, uncap1, regionThe } from "./utils";
    import string from './strings.js';
	import topic from './topicLookup.js';

	let defaultLoc = 'Manchester';

	const types = {
		ew: {name: '', pl: ''},
		wd: {name: 'Ward', pl: 'Wards'},
		lad: {name: 'District', pl: 'Districts'},
		rgn: {name: 'Region', pl: 'Regions'},
		ctry: {name: 'Country', pl: 'Countries'}
	};
	let options, selected, place, quartiles;

	let load = false
    const onRosaeNlgLoad = () => { load = true }

	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/places_2020.csv").then(res => {
		res.forEach(d => {
			d.typepl = types[d.type].pl;
			d.typenm = types[d.type].name;
		});
		options = res.sort((a, b) => a.name.localeCompare(b.name));
		selected = options.find(d => d.name == defaultLoc);
		loadArea(selected.code)
	});
	function loadArea(code) {
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + '.json')
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			quartiles = null;
			place = json;
			console.log("Place", place)
		})
	}

	let triples = [['population_all', 'value_change', 28.08],
 ['population_all', 'value_change_localRank', 1],
 ['health_good', 'perc_change', 15.87],
 ['health_good', 'perc_change_localRank', 1],
 ['ethnicity_white', 'perc_change', -14.33],
 ['ethnicity_white', 'perc_change_localRank', -1],
 ['agemed_all', 'value_change', -5.88],
 ['agemed_all', 'value_change_localRank', -1],
 ['economic_student', 'perc_change', 2.67],
 ['economic_student', 'perc_change_localRank', 1]]

	let grewSyn = {
		1: "ballooned",
		2: "grew",
		3: "remained relatively stable",
		4: "shrunk",
		5: "fell sharply"
	}
	let num_words = {'one in two': 0.5, 'one in three': 0.333, 'one in four': 0.25, 'one in five': 0.2, 'one in six': 0.167, 'one in seven': 0.143, 'one in eight': 0.125, 'one in nine': 0.111, '1 in 10': 0.1,'1 in 11' : 0.09, '1 in 12' : 0.083, '1 in 13' : 0.077, '1 in 14' : 0.071, '1 in 15' : 0.067, '1 in 16' : 0.063, '1 in 17' : 0.059, '1 in 18' : 0.056, '1 in 19' : 0.053 ,'1 in 20': 0.05, '2 in 10': 0.2, '3 in 10': 0.3, '4 in 10': 0.4, '6 in 10': 0.6, '7 in 10': 0.7, '8 in 10': 0.8, '9 in 10': 0.9, 'all': 1.0, 'quarter of a million': 250000, 'half a million': 500000, 'three quarters of a million': 750000}
	function get_word(fraction) {
		let OverUnder;
		let lowest = 2000000;
		let lowest_label;
		for (const label in num_words) {
			if (Math.abs(fraction-num_words[label])<lowest) {
				lowest = Math.abs(fraction-num_words[label]) 
				lowest_label = label
				if (fraction-num_words[label]==0) {
					OverUnder = 0; 
				}
				else if (fraction-num_words[label]>0) {
					OverUnder = 1;
				}
				else if (fraction-num_words[label]<0) {
					OverUnder = -1;
				} } }
		return [OverUnder, lowest_label]
	}

	function results(place) {
		let s = place.stories.map(d => d.label.split("_"))
		console.log('s', s)
		let locRank = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"][d[2]][d[3]]))
		console.log('locrank', locRank)
		return rosaenlg_en_US.render(string, {
			language: 'en_UK',
			place: place,
			data: place.data,
			parent: uncap1(regionThe(place.parents[0].name)),
			s: s,
			priorities: place.Priorities,
			grewSyn: grewSyn,
			locRank: locRank,
			topic: topic,
			get_word: get_word
		})
	}
</script>

<svelte:head>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>

{#if place}
	{#if load}
		<main>
			<h1>{place.name}: What's changed</h1>
			{@html results(place)}
		</main>
	{/if}
{/if}

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		width: 50%
	}

	h1 {
		font-size: 4em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>