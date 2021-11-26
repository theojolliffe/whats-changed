<script>
	import { getData, uncap1, regionThe, drop } from "./utils";
	import Select from "./ui/Select.svelte";
	import { load } from "archieml"; //this is the parser from ArchieML to JSON
	import { onMount } from 'svelte';
	import robojournalist from 'robojournalist';

	var options, selected, place, quartiles, locRankCha, locRankCur, eng, rgncode, rgn, s, natRankCha, natRankCur, topics, expand;

    var topics;
    fetch("./archie.aml")
        .then((res) => res.text())
        .then((txt) => (topics = load(txt)))

	var puggy;
    fetch("./puggy.pug")
        .then((res) => res.text())
        .then((txt) => (puggy = txt))

	var stand;
	fetch("./standf.pug")
        .then((res) => res.text())
        .then((txt) => (stand = txt))

	const types = {
		ew: {name: '', pl: ''},
		wd: {name: 'Ward', pl: 'Wards'},
		lad: {name: 'District', pl: 'Districts'},
		rgn: {name: 'Region', pl: 'Regions'},
		ctry: {name: 'Country', pl: 'Countries'}
	};

	let loaded = false
    const onRosaeNlgLoad = () => { loaded = true }

	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/places_2020.csv").then(res => {
		res.forEach(d => {
			d.typepl = types[d.type].pl;
			d.typenm = types[d.type].name;
		});
		res = res.filter(d => d['type']=='lad')
		options = res.sort((a, b) => a.name.localeCompare(b.name));
		let  defaultLoc = options[Math.round(336*Math.random())]['name']
		// defaultLoc = 'Greenwich'; // Basingstoke and Deane // Test valley
		console.log(defaultLoc)
		selected = options.find(d => d.name == defaultLoc);
		console.log(selected.code)
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

			if (place.data.population.value.change.all>8) {
				expand = "expanded"
			} else if (place.data.population.value.change.all>3) {
				expand = "grew"
			} else if (place.data.population.value.change.all>0) {
				expand = "did not change much"
			} else {
				expand = "shrunk"
			} 

			s = place.stories.map(d => d.label.split("_"))
			s.forEach(e => {
				if (e.length>4) {
					e[3] = e[3]+"_"+e[4]
					e.pop()
				}
			});
			rgncode = place.parents[0].code
			console.log("Place", place)
			console.log("Stories", place.stories)
			console.log('s', s)
			locRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"][d[2]][d[3]]))
			natRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"][d[2]][d[3]]))
			locRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"]['2011'][d[3]]))
			natRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"]['2011'][d[3]]))

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
		1: "expanded",
		2: "grew",
		3: "grew",
		4: "remained relatively stable",
		5: "fell"
	};
	
	let num_word = {'quarter of a million': 250000, 'half a million': 500000, 'three quarters of a million': 750000, 'one million': 1000000};

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
		let sigfig = Number.parseFloat(Number.parseFloat(x).toPrecision(3))
		let text;
		if (x-sigfig<-x/100) {
			text = "under "
		}	
		if (x-sigfig<-x/800) {
			if (Math.round(Math.random())==1) {
				text = "almost "
			} else {
				text = "just under "
			}
		}
		else if (x-sigfig>x/100) {
			text = " just over "
		}
		else if (x-sigfig>x/800) {
			text = "just over "
		}
		else {
			text = ""
		}
		return [text, sigfig];
	}
	let chains = {
		'good': ['bad', 'fair'],
		'bad': ['good', 'fair'],
		'white': ['black', 'asian'],
		'black': ['white', 'asian'],
		'asian': ['white', 'black'],
		'rented_private': ['rented_social', 'owned'],
		'rented_social': ['rented_private', 'owned'],
		'owned': ['rented_private', 'rented_social'],
		'student': ['employee', 'unemployed', 'self-employed'],
		'self-employed': ['employee', 'unemployed', 'student'],
		'employee': ['unemployed', 'self-employed', 'student',],
		'unemployed': ['employee', 'self-employed', 'student'],
		'car_van': ['bus', 'train_metro', 'foot', 'home'],
		'bus': ['car_van', 'train_metro', 'foot', 'home'],
		'train_metro': ['bus', 'car_van', 'foot', 'home'],
		'foot': ['bus', 'train_metro', 'car_van', 'home'],
		'home': ['bus', 'train_metro', 'foot', 'car_van'],
		'OnePerson': ['Cohabiting', 'Married'],
		'Cohabiting': ['OnePerson', 'Married'],
		'LoneParent': ['Married', 'Cohabiting'],
		'Christian': ['Muslim', 'Noreligion'],
		'Muslim': ['Christian', 'Noreligion'],
		'Noreligion': ['Christian', 'Muslim'],
		'Buddhist': ['Hindu', 'Sikh'],
		'Hindu': ['Sikh', 'Buddhist'],
		'Jewish': ['Christian', 'Muslim'],
		'Sikh': ['Hindu', 'Buddhist'],
		'Single': ['Married', 'Seperated'],
		'Married': ['Single', 'Seperated'],
		'Seperated': ['Married', 'Single'],
		'40PlushoursWeek': ['20to49hoursWeek', '1to19hoursWeek'],
		'20to49hoursWeek': ['40PlushoursWeek', '1to19hoursWeek'],
		'1to19hoursWeek': ['40PlushoursWeek', '20to49hoursWeek'],
		'Kids': ['NoKids', 'NonDepKids'],
		'NoKids': ['Kids', 'NonDepKids'],
		'NonDepKids': ['Kids', 'NoKids'],
		'Male1-15': ['Male49plus'],
		'Male49plus': ['Male1-15'],
		'Female1-15': ['Female49plus'],
		'Female49plus': ['Female1-15']
	}

	function cur(s, place, i, type) {
		if (type=="rl") {
			type = "_rank_local"
		} else if (type=="r") {
			type = "_rank"
		} else {
			type = ""
		}
		return place.data[s[i][0]][s[i][1]+type][2011][s[i][3]]
	}

	function cha(s, place, i, type) {
		if (type=="rl") {
			type = "_rank_local"
		} else if (type=="r") {
			type = "_rank"
		} else {
			type = ""
		}
		return place.data[s[i][0]][s[i][1]+type]['change'][s[i][3]]
	}

	function qui(n) {
		return Math.ceil(5*n/331)
	}

	function otherEst(s, place, i, hiLo, type) {
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
		if (Object.keys(optAr).length>1) {
			if (hiLo=='lowest') {
				for (let [k, v] of Object.entries(optAr)) {
					if (v > 0) {
						delete optAr[k];
					}
				}
				if (optAr.length>0) {
					optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] > optAr[b] ? a : b);
				} else {
					optArKey = undefined
				}
				
			}
			if (hiLo=='highest') {
				for (let [k, v] of Object.entries(optAr)) {
					if (v < 0) {
						delete optAr[k];
					}
				}
				if (optAr.length>0) {
					optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] < optAr[b] ? a : b);
				} else {
					optArKey = undefined
				}
			}
		} else {
			optArKey = Object.keys(optAr)
		}
		return optArKey
	}

	function otherRank(s, place, i, t="r") {
		let locExt = ""
		if (t=="rl") {
			locExt = "_local"
		}
		return place.data[s[i][0]][s[i][1]+'_rank'+locExt]['change'][otherEst(s, place, i, cha(s, place, i, t), 'change')]
	}

	function ud(n, w1, w2) { if (n<0) { return w2 } else { return w1 } }
	var city
	if (parent=="London") {
		city = "city"
	} else {
		city = "region"
	}

	function iterate(obj, pname) {
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'object') {
				iterate(obj[key], pname)
			} else {
				obj[key] = robojournalist(obj[key], {
					expanded: expand,
					plcname: pname,
				})
			}
		})
	}


	function standfirst(place, topicsIn) {

		var o = JSON.parse(JSON.stringify(topicsIn));
		iterate(o, place.name)

		let sf = []
		let changeMag = 0
		place.stories.forEach(e => {
			if ((sf.length<4)&(Math.abs(e['value'])>3)) {
				sf.push(e['label'].split("_"))
				changeMag = changeMag+Math.abs(e['value'])
			}
		});
		return rosaenlg_en_US.render(stand, {
			language: 'en_UK',
			place: place,
			topics: o,
			s: s,
			sf: sf,
			changeMag: changeMag,
			grewSyn: grewSyn,
			qui: qui,
			natRankCha: natRankCha,
		})
	}	



	function results(place, topicsIn) {
		
		var o = JSON.parse(JSON.stringify(topicsIn));

		console.log("topics", o)
		console.log("et ", place.name)
		iterate(o, place.name)

		function topic(i, top) {
			let ttop
			if (top) {
				ttop = top
			} else {
				ttop = s[i][3]
			}
			return o[s[i][0]][ttop]
		}

		function cap(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		
		return rosaenlg_en_US.render(puggy, {
			language: 'en_UK',
			place: place,
			data: place.data,
			// replace eng with country data (inc Wales)
			eng: eng,
			rgn: rgn,
			parent: uncap1(regionThe(place.parents[0].name)),
			parentNT: uncap1(regionThe(place.parents[0].name, "NT")),
			s: s,
			stories: place.stories,
			priorities: place.Priorities,
			grewSyn: grewSyn,
			locRankCha: locRankCha,
			natRankCha: natRankCha,
			locRankCur: locRankCur,
			natRankCur: natRankCur,
			hiRank: place.hiRank,
			topic: topic,
			topics: o,
			chains: chains,
			country: "England",
			get_word: get_word,
			figs: figs,
			otherEst: otherEst,
			cur: cur,
			cha: cha,
			qui: qui,
			cap,cap,
			otherRank: otherRank,
			ud: ud,
			city: city,
			drop, drop,
		})

	}
	function goTop() {
		let creation = document.getElementById('create')
		creation.scrollIntoView();
	}

	onMount(() => {
		setInterval(function(){
		d3.selectAll('div#visph').attr('style', `
			background-color: #f6f6f6; 
			color: #e1e7ea; 
			height: 240px;
			padding: 80px;
			font-size: 2.8rem;
			font-weight: 600;
			margin-bottom: 80px;`)
		}, 1000)
	})
</script>

<svelte:head>
	<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>

<div>
	{#if place}
		{#if loaded}
			{#if eng}	
				{#if rgn}
					<div id="sf">
						<div style="width: 640px; margin:0 auto;">
							<h1>{place.name}: <span style="font-weight: 400;">What's changed</span></h1>
							<div>
								<div style="width: 640px; margin: 50px auto;">
									<Select {options} bind:selected group="typenm" search={true} on:select="{() => { if (selected) { loadArea(selected.code) }}}"/>
								</div>
							</div>
							{@html standfirst(place, topics)}
							<p>Here are some of the <span class="back-to-top" on:click={goTop}>most notable changes</span> from across the {(place.gss)?place.gss.long:"local authority district"}.</p>
						</div>
					</div>
					<main>
						{@html results(place, topics)}

						<hr style="width: 40%; margin: 60px auto 30px auto;"/>
						<h2 id="create">Creating this article</h2>
						<p>This article has been generated using a semi-automated system for story selection and data-to-text templating.</p>
						<p>The system relies upon a computer programme to decide which topics are relevant to specific areas and describe the data in words.</p>
						<p>For each local authority district, the variables that have changed the most since 2011 are selected automatically. Variables that have experienced a considerably larger or smaller change than the regional or national averages are also selected.</p>
						<p>The decisions made by the computer programme were coded by staff in the ONS Digital Publishing team in advance of the release of Census 2021 data.</p>
						<div style="height:200px"></div>
					</main>
				{/if}
			{/if}
		{/if}
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
		padding: 0px;
		line-height: 2;
		color: #323132;
	}

	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		width: 640px
	}

	h1 {
		font-size: 3em;
		line-height: 1.5;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	div#visph {
		background-color: #afcbd6;
		color: #003C57;
		height: 240px;
		padding: 80px;
		font-size: 3rem;
		font-weight: 600;
	}
	span.back-to-top {
		text-decoration: underline;
		color: #206095;
		cursor: pointer;
	}
	div#sf {
		background-color: #F5F5F6;
		padding: 15px;
		font-size: 1.2rem;
	}

</style>