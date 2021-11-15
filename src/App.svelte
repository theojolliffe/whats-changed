<script>
	import { getData, uncap1, regionThe } from "./utils";
    import string from './strings.js';
	import topics from './topicLookup.json';

	let defaultLoc = 'Manchester';

	const types = {
		ew: {name: '', pl: ''},
		wd: {name: 'Ward', pl: 'Wards'},
		lad: {name: 'District', pl: 'Districts'},
		rgn: {name: 'Region', pl: 'Regions'},
		ctry: {name: 'Country', pl: 'Countries'}
	};
	var options, selected, place, quartiles, eng, rgncode, rgn;

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
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + ".json")
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			quartiles = null;
			place = json;
			rgncode = place.parents[0].code
			console.log("Place", place)
			fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + rgncode + ".json")
			.then(res => res.json())
			.then(json => {
				json.children = options.filter(d => d.parent == code);
				json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
				quartiles = null;
				rgn = json;
			})
		})
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json")
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			quartiles = null;
			eng = json;
		})
	}
	


	let grewSyn = {
		1: "ballooned",
		2: "grew",
		3: "remained relatively stable",
		4: "shrunk",
		5: "fell sharply"
	}
	let gssLookup = {"E09": "London borough", "E08": "metropolitan district", "E07": "district", "E06": "unitary authority"};

	let num_word = {'one': 1, 'quarter of a million': 250000, 'half a million': 500000, 'three quarters of a million': 750000};

	let frac_word = {'one in two': 0.5, 'one in three': 0.333, 'one in four': 0.25, 'one in five': 0.2, 'one in six': 0.167, 'one in seven': 0.143, 'one in eight': 0.125, 'one in nine': 0.111, '1 in 10': 0.1,'1 in 11' : 0.09, '1 in 12' : 0.083, '1 in 13' : 0.077, '1 in 14' : 0.071, '1 in 15' : 0.067, '1 in 16' : 0.063, '1 in 17' : 0.059, '1 in 18' : 0.056, '1 in 19' : 0.053 ,'1 in 20': 0.05, '2 in 10': 0.2, '3 in 10': 0.3, '4 in 10': 0.4, '6 in 10': 0.6, '7 in 10': 0.7, '8 in 10': 0.8, '9 in 10': 0.9, 'all': 1.0};

	function get_word(num, dict) {
		if (dict == "frac") {
			dict = frac_word
		} else if (dict == "num") {
			dict = num_word
		}
		let OverUnder;
		let lowest = 2000000;
		let lowest_label;
		for (const label in dict) {
			if (Math.abs(num-dict[label])<lowest) {
				lowest = Math.abs(num-dict[label]) 
				lowest_label = label
				if (num-dict[label]==0) {
					OverUnder = "about"; 
				}
				else if (num-dict[label]>0) {
					OverUnder = "just over";
				}
				else if (num-dict[label]<0) {
					OverUnder = "just under";
				} } }
		return [OverUnder, lowest_label]
	}
	function figs(x) {
		let sigfig = Number.parseFloat(Number.parseFloat(x).toPrecision(2))
		let text;
		if (x-sigfig<-x/100) {
			text = "under "
		}	
		if (x-sigfig<-x/200) {
			if (Math.round(Math.random())==1) {
				text = "almost "
			} else {
				text = "just under "
			}
		}
		else if (x-sigfig>x/100) {
			text = "over "
		}
		else if (x-sigfig>x/200) {
			text = "just over "
		}
		else {
			text = "about "
		}
		return [text, sigfig];
	}
	let chains = {
		'good': ['bad', 'fair'],
		'white': ['black', 'asian'],
		'rented_private': ['rented_social', 'owned'],
		'inactive': ['employee', 'unemployed', 'self-employed'],
		'car_van': ['bus', 'train_metro', 'foot', 'home'],
		'OnePerson': ['MarriedWKids', 'MarriedNKids', 'LoneWKids']
	}

	function results(place) {
		var s = place.stories.map(d => d.label.split("_"))
		s.forEach(e => {
			if (e.length>4) {
				e[3] = e[3]+"_"+e[4]
				e.pop()
			}
		});
		console.log('s', s)
		function topic(i, top) {
			let ttop
			if (top) {
				ttop = top
			} else {
				ttop = s[i][3]
			}
			return topics[s[i][0]+"_"+ttop]
		}

		function otherEst(i, hiLo, type) {
			if (typeof hiLo==="number" & hiLo<0) {
				hiLo = "highest"
			} else if (typeof hiLo==="number") {
				hiLo = "lowest"
			}
			let optAr = Object.assign({}, place.data[s[i][0]][s[i][1]+'_rank_local'][type]);
			let l = new Set(chains[s[i][3]])
			for (let prop of Object.keys(optAr)) {
				if (!l.has(prop)) {
					delete optAr[prop];
				}
			}
			let optArKey
			if (hiLo=='lowest') {
				for (let [k, v] of Object.entries(optAr)) {
					if (v > 0) {
						delete optAr[k];
					}
				}
				optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] > optAr[b] ? a : b);
			}
			if (hiLo=='highest') {
				for (let [k, v] of Object.entries(optAr)) {
					if (v < 0) {
						delete optAr[k];
					}
				}
				optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] < optAr[b] ? a : b);
			}
			return optArKey
		}

		function cur(i, type) {
			if (type=="rl") {
				type = "_rank_local"
			} else if (type=="r") {
				type = "_rank"
			} else {
				type = ""
			}
			return place.data[s[i][0]][s[i][1]+type][2011][s[i][3]]
		}
		function cha(i, type) {
			if (type=="rl") {
				type = "_rank_local"
			} else if (type=="r") {
				type = "_rank"
			} else {
				type = ""
			}
			return place.data[s[i][0]][s[i][1]+type]['change'][s[i][3]]
		}

		let locRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"][d[2]][d[3]]))
		let natRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"][d[2]][d[3]]))
		let locRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"]['2011'][d[3]]))
		let natRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"]['2011'][d[3]]))

		return rosaenlg_en_US.render(string, {
			language: 'en_UK',
			place: place,
			data: place.data,
			eng: eng,
			rgn: rgn,
			parent: uncap1(regionThe(place.parents[0].name)),
			s: s,
			priorities: place.Priorities,
			grewSyn: grewSyn,
			locRankCha: locRankCha,
			natRankCha: natRankCha,
			locRankCur: locRankCur,
			natRankCur: natRankCur,
			hiRank: place.hiRank,
			topic: topic,
			chains: chains,
			country: "England",
			get_word: get_word,
			figs: figs,
			otherEst: otherEst,
			cur: cur,
			cha: cha,
			gssLookup: gssLookup
		})
	}
</script>

<svelte:head>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>

{#if place}
	{#if load}
		{#if eng}	
			{#if rgn}	
				<main>
					<h1>{place.name}: What's changed</h1>
					{@html results(place)}
				</main>
			{/if}
		{/if}
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