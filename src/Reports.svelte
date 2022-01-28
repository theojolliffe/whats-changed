<script>
	import { uds, adv, udord, sign, nuword, eq, ageBandLU, ord, uncap1, getData, regionThe, drop, ud, otherRank, otherEst, qui, cha, cur, figs, get_word, city, chains, prev } from "./utils";
	import Select from "./ui/Select.svelte";
	import { load } from "archieml"; 
	import { onMount } from 'svelte';
	import robojournalist from 'robojournalist';
	import pluralize from 'pluralize';
	import Fuse from 'fuse.js'
	import { LineChart, ScatterChart, ColumnChart } from '@onsvisual/svelte-charts';
	import AgeChart from './charts/small-multiple/AgeChart.svelte';
	import DotPlotChart from './charts/DotPlotChart.svelte';

	function fuzz(w1, w2) {
		const options = {
			includeScore: true
		}
		const fuse = new Fuse([w1], options)
		const result = fuse.search(w2)
		if (result.length>0) {
			return false
		} else {
			return true
		}
	}

	var options, selected, place, locRankCha, locRankCur, eng, rgncode, rgn, s, natRankCha, natRankCur, topics, wal, found, ladData, props;
	var health, expand, ladLoaded, cou;

	const findOne = (haystack, arr) => {
		return arr.some(v => haystack.includes(v));
	};


	function cap(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var more = false;

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
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/laddata.csv").then(res => {
		res.forEach(d => {
			d.code = d[""];
			delete d[""];
		});
		ladData = res
		ladLoaded = true
	});


	var regionLU = {};
	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/Corresponding%20Local%20Authorities-Table%201.csv").then(res => {
		res.forEach(d => {
			regionLU[d['Name']] = d['Region/Country'];
		});
	});

	var countyLU = {};
	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/Local_Authority_District_to_County_(April_2021)_Lookup_in_England.csv").then(res => {
		res.forEach(d => {
			countyLU[d['LAD21NM']] = d['CTY21NM'];
		});
	});


	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/Local_Authority_Districts_(May_2021)_UK_BFE_V3.csv").then(res => {
		res.forEach(d => {
			d.code = d.LAD21CD
			d.name = d.LAD21NM
		})
		res = res.filter(d => (d['LAD21CD'].substring(0,1)!='S')&(d['LAD21CD'].substring(0,1)!='N'))

		options = res.sort((a, b) => a.LAD21NM.localeCompare(b.LAD21NM));
		let defaultLoc = options[Math.round(331*Math.random())]['LAD21NM']
		defaultLoc = 'New Forest';

		console.log(defaultLoc)
		selected = options.find(d => d.LAD21NM == defaultLoc);
		console.log(selected.LAD21CD)
		loadArea(selected.LAD21CD)
	});
	function loadArea(code) {
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + ".json")
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			place = json;
			rgncode = place.parents[0].code

			fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + rgncode + ".json")
			.then(res => res.json())
			.then(json => {
				json.children = options.filter(d => d.parent == code);
				json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
				rgn = json;
				console.log('rgn', rgn)
			})

			// Define the word to describe population change in standfirst
			if (place.data.population.value.change.all>8) {
				expand = "expanded"
			} else if (place.data.population.value.change.all>3) {
				expand = "grew"
			} else if (place.data.population.value.change.all>0) {
				expand = "did not change much"
			} else {
				expand = "shrunk"
			} 
			// Define the word to describe health change in standfirst
			if (place.data.health.perc.change.good>0) {
				health = "improved"
			} else if (place.data.health.perc.change.good<0) {
				health = "deteriorated"
			}


			s = place.stories.map(d => d.label.split("_"))
			s.forEach(e => {
				if (e.length>4) {
					e[3] = e[3]+"_"+e[4]
					e.pop()
				}
			});
			locRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"][d[2]][d[3]]));
			natRankCha = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"][d[2]][d[3]]));
			locRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank_local"]['2011'][d[3]]));
			natRankCur = s.map(d => parseInt(place.data[d[0]][d[1]+"_rank"]['2011'][d[3]]));

		})
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json")
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			eng = json;
		})
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/W92000004.json")
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
			wal = json;
		})
	}

	let grewSyn = {
		1: "expanded",
		2: "grew",
		3: "grew",
		4: "remained relatively stable",
		5: "fell"
	};
	
	function iterate(obj, pname) {
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'object') {
				iterate(obj[key], pname)
			} else {
				obj[key] = robojournalist(obj[key], {
					health, health,
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

	function results(rgn, place, topicsIn) {
		
		var o = JSON.parse(JSON.stringify(topicsIn));
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
		console.log("topics", o)
		cou = place.parents[0].name=="Wales"?wal:eng

		let res = rosaenlg_en_US.render(puggy, {
			language: 'en_UK',
			place: place,
			data: place.data,
			cou: cou,
			// replace eng with country data (inc Wales)
			eng: eng,
			rgn: rgn,
			uncap1: uncap1,
			regionThe: regionThe,
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
			country: place.parents[0].name=="Wales"?"Wales":"England",
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
			ord: ord,
			ageBandLU: ageBandLU,
			eq: eq,
			nuword: nuword,
			sign: sign,
			udord: udord, 
			near: place.nearbyArea.nearTops,
			simi: place.similar,
			adv: adv,
			uds: uds,
			more: more,
			pluralize, pluralize,
			countyLU: countyLU,
			fuzz: fuzz,
			prev: prev,
			regionLU: regionLU,
			findOne: findOne
		})
		return res.split(`<div id="esc123"></div>`)

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




	// MAKE CHARTS

	function makeChartData(place, region, england, i) {
		let temp = []
		let arr = [place, region, england]
		if (place) {
			for (const k in {2015: "", 2016: "", 2017: "", 2018: ""}) {
					for (const j in arr) {
						let top = arr[j].data[subDomains[i]['Domain']]['subdomains'][subDomains[i]['Subdomain']].total
						temp.push({
							year: parseInt(k),
							value: top[k]['value'],
							group: arr[j].name
					});
				}
			}
		}
		return temp
	}

	function fbp(x) {
		return Number.parseFloat(Number.parseFloat(0.714*x).toPrecision(2))
	}

	function makeProps(i) {
		let s = place.stories[i].label.split("_")
			if (s.length>4) {
				s[3] = s[3]+"_"+s[4]
				s.pop()
			}
		if (s[0]=="agemed") {
			function dtrans(d, g) {
				let a = []
				Object.keys(d).forEach(e => {
					a.push({'x': e, 'y': d[e], 'g': g})
				});
				return a
			}
			let chartData = [
				[dtrans(cou.data.age10yr.perc['2001'], 2011), dtrans(cou.data.age10yr.perc['2011'], 2021)],
				[dtrans(rgn.data.age10yr.perc['2001'], 2011), dtrans(rgn.data.age10yr.perc['2011'], 2021)],
				[dtrans(place.data.age10yr.perc['2001'], 2011), dtrans(place.data.age10yr.perc['2011'], 2021)],

			]
			let props ={
						legend: true,
						height: 120,
						chartData: chartData,
						labels: [cou.name, rgn.name, place.name],
						xKey: "value",
						yKey: "year"
					}
			return props
		}
		else if (place.stories[i].type.includes('size')) {
			if (s[0]=="population") {
				if (rgn.name == 'Wales') {
					return {
						height: 120,
						data: [
							{label: eng.name, 2011: fbp(eng.data.density.value[2001].all), 2021: fbp(eng.data.density.value[2011].all)},
							{label: rgn.name, 2011: fbp(rgn.data.density.value[2001].all), 2021: fbp(rgn.data.density.value[2011].all)},
							{label: place.name, 2011: fbp(place.data.density.value[2001].all), 2021: fbp(place.data.density.value[2011].all)},
						],
					}
				} else {
					return {
						height: 120,
						data: [
							{label: rgn.name, 2011: fbp(rgn.data.density.value[2001].all), 2021: fbp(rgn.data.density.value[2011].all)},
							{label: place.nearbyArea.nearTops.name.name, 2011: fbp(place.nearbyArea.nearTops.name.data.density.value[2001].all), 2021: fbp(place.nearbyArea.nearTops.name.data.density.value[2011].all)},
							{label: place.name, 2011: fbp(place.data.density.value[2001].all), 2021: fbp(place.data.density.value[2011].all)},
						],
					}
				}
			}
			else {
				if (rgn.name == 'Wales') {
					return {
						legend: true,
						height: 120,
						data: [

							{
								label: rgn.name, 
								2011: rgn.data[s[0]][s[1]][2001][s[3]],
								2021: rgn.data[s[0]][s[1]][2011][s[3]]
							},
							{
								label: place.nearbyArea.nearTops.name, 
								2011: place.nearbyArea.nearTops.data[s[0]][s[1]][2001][s[3]], 
								2021: place.nearbyArea.nearTops.data[s[0]][s[1]][2011][s[3]],
							},
							{
								label: place.name, 
								2011: place.data[s[0]][s[1]][2001][s[3]],
								2021: place.data[s[0]][s[1]][2011][s[3]]
							},
						],
					}
				} else {
					return {
						legend: true,
						height: 120,
						data: [
							{
								label: eng.name, 
								2011: eng.data[s[0]][s[1]][2001][s[3]], 
								2021: eng.data[s[0]][s[1]][2011][s[3]],
							},
							{
								label: place.parents[0].name,
								2011: rgn.data[s[0]][s[1]][2001][s[3]], 
								2021: rgn.data[s[0]][s[1]][2011][s[3]]
							},
							{
								label: place.name, 
								2011: place.data[s[0]][s[1]][2001][s[3]], 
								2021: place.data[s[0]][s[1]][2011][s[3]]
							},
						],
					}
				}
			}
		}
		else {
			// ScatterChart
			var chartdata
			if (s[0]=="population") {
				s[0] = 'density';
				s[3] = 'all';
			}
			chartdata = ladData.filter(d => (d['parent']==place.parents[0].name)&(d.topic == s[0]+"_"+s[3]))
			
			chartdata = chartdata.map(d => ({ 'change': d['change'], 'value': (s[0]=="density")? 0.714*parseFloat(d[2011]) : parseFloat(d[2011]), 'unique': d['lad'], 'id': d['parent']}))
			chartdata.forEach((item, i) => {
				if (item.unique==place.name) {
					item.id = place.name
				} else if (item.id == place.parents[0].name) {
					item.id = "Rest of "+uncap1(regionThe(place.parents[0].name))
				} else {
					item.id = "Rest of England"
				}
			})
			chartdata.push({
				change: +cou.data[s[0]][s[1]]['change'][s[3]],
				value: +cou.data[s[0]][s[1]]['2011'][s[3]],
				unique: 'Average across ' + cou.name, 
				id: 'Average across ' + cou.name, 
			})

			return props = {
				mode: "stacked",
				line: false,
				legend: true,
				data: chartdata,
				xKey: "value",
				yKey: null,
				rKey: "change",
				r: [3, 9],
				zKey: "id",
			}
		}
	}
	function chartType(i) {
		let s = place.stories[i].label.split("_")
		if (s.length>4) {
			s[3] = s[3]+"_"+s[4]
			s.pop()
		}		
		if (s[0]=='agemed') {
			return AgeChart
		}
		else if (place.stories[i].type.includes('size')) {
			return DotPlotChart
		} else {
			// LINECHART
			return ScatterChart
		}
	}
	
	function readMore() {
		more = !more
		results = results
	}

</script>

<svelte:head>
	<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>

<div>
	{#if place}
		{#if ladLoaded}
		{#if loaded}
			{#if eng}	
				{#if rgn}
					<div id="sf">
						<div style="width: 640px; margin:0 auto;">
							<h1>{cap(place.name)}: <span style="font-weight: 400;">Changes over time</span></h1>
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
						{#each results(rgn, place, topics) as res, i (i)}
							<!-- {#if i<19} -->
								{@html res}
								<div style="width: 100%">
									<svelte:component this="{chartType(i)}" {...makeProps(i)}/>
								</div>
							<!-- {/if} -->
						{/each}
						<button on:click={readMore}>
							<div class="triangle-container">
								<svg height="25" width="50">
										{#if more}
											<polygon points="25,10 15,20 25,10 35,20" class="triangle" />
										{:else}
											<polygon points="25,20 15,10 25,20 35,10" class="triangle" />
										{/if}
								</svg>
							</div>
							{more?'Read less':'Read more'}
						</button>
						<hr/>
						<h2 id="create">Creating this article</h2>
						<p>This article was generated using some automation. Topics are selected based on the most notable changes seen in each local authority.</p>
						<p>Notable changes include a high percentage point shift, a pattern of change that differs from the pattern seen at the regional or national level, and the shifting of a variable for which the area ranks considerably high or low.</p>
						<div style="height:200px"></div>
					</main>
				{/if}
			{/if}
		{/if}
		{/if}
	{/if}
</div>

<style>
	
	hr {
		margin: 60px auto 30px;
		background-color: #eee;
	}
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
		padding: 0px;
		line-height: 2;
		color: #323132;

	}
	.triangle{
  fill: transparent;
  stroke: #206095;
    stroke-width: 3;
  transition: all 0.8s ease-in-out;
  /* transform: rotate(-180deg);  */
}
.triangle-container {
    float: left;
}

button {
	color: #206095;
    background-color: transparent;
    outline: transparent;
    border: none;
    text-decoration: underline;
    font-weight: 700;
    font-size: 18px;
	margin-top: 60px;
	cursor: pointer;
}
button:active{
    background-color: transparent;
}

	:global(h5) {
		font-size: 18px;
		font-weight: 400;
		color: #707071;
		margin-top: 10px;
	}
	:global(h4) {
		margin-top: 50px;
		margin-bottom: 10px;
	}
	:global(h2) {
		margin-top: 60px;
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