<script>
	import { ageBandLU, ord, uncap1, regionThe, drop, iterate, ud, otherRank, otherEst, qui, cha, cur, figs, get_word, city,  chains } from "./utils";
	import Select from "./ui/Select.svelte";
	import Selectb from "./ui/SelectB.svelte";
	import { load } from "archieml"; //this is the parser from ArchieML to JSON
	import { onMount } from 'svelte';

	var selected, selectedb, quartiles, locRankCha, locRankCur, eng, rgncode, rgnLoad, natRankCha, natRankCur, topics, topic;
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
	// Switch off when timeout function and change selected to agemed when not developing
	selected = topicOptions.find(d => d.value == "agemed_value_change")
	// setTimeout(function() {
	// 	loadTopic(selected.value)
	// }, 6000);

	console.log('topicOptions', topicOptions)
	var subTopicOpt = {
		'agemed_value_change': false,
		'economic_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Employed', 'value': 'employee'},
			{'label': 'Self-employed', 'value': 'self-employed'},
			{'label': 'Student', 'value': 'student'},
			{'label': 'Unemployed', 'value': 'unemployed'},
		],
		'ethnicity_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Asian', 'value': 'asian'},
			{'label': 'Black', 'value': 'black'},
			{'label': 'White', 'value': 'white'},
		],
		'health_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Good', 'value': 'good'},
			{'label': 'Fair', 'value': 'fair'},
			{'label': 'Bad', 'value': 'bad'},
		],
		'hoursworked_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': '1-15 hours per week', 'value': 'Male1-15'},
			{'label': 'Over 49 hours per week', 'value': 'Male49plus'},
		],
		'children_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Households with children', 'value': 'Kids'},
			{'label': 'Households without children', 'value': 'NoKids'},
			{'label': 'Households with only non-dependent children', 'value': 'NonDepKids'},
		],
		'household_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Cohabiting', 'value': 'Cohabiting'},
			{'label': 'Married couple', 'value': 'Married'},
			{'label': 'Single parent', 'value': 'LoneParent'},
			{'label': 'Single person', 'value': 'OnePerson'},
		],
		'marital_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Married', 'value': 'Married'},
			{'label': 'Seperated', 'value': 'Seperated'},
			{'label': 'Single', 'value': 'Single'},
		],
		'population_value_change': false,
		'religion_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Buddhist', 'value': 'Buddhist'},
			{'label': 'Christian', 'value': 'Christian'},
			{'label': 'Hindu', 'value': 'Hindu'},
			{'label': 'Jewish', 'value': 'Jewish'},
			{'label': 'Muslim', 'value': 'Muslim'},
			{'label': 'No religion', 'value': 'Noreligion'},
		],
		'tenure_perc_change': [
			{'label': 'All', 'value': 'all'},
			{'label': 'Homeownership', 'value': 'owned'},
			{'label': 'Private renting', 'value': 'rented_private'},
			{'label': 'Social renting', 'value': 'rented_social'},
		],
	}

	var regionArr = ['E12000001',
'E12000002',
 'E12000003',
 'E12000004',
 'E12000005',
 'E12000006',
 'E12000007',
 'E12000008',
 'E12000009',
'W92000004']

	var regions = []
	$: thisReg = "null"

	fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json")
		.then(res => res.json())
		.then(json => {
			quartiles = null;
			eng = json;
			console.log('eng', eng)
			loaded1 = true
		})
		.then(d => {
			regionArr.forEach(thisCode => {
				fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/"+thisCode+".json")
				.then(res => res.json())
				.then(json => {
					regions.push(json);
				})
			})
		})
		.then(d => {
			rgnLoad = true
		})
		console.log('regions', regions)

	var loaded1 = false
	var loadedb = false
	var places = []
	var codeArr = ["E06000047", "E06000005", "E06000001", "E06000002", "E06000057", "E06000003", "E06000004", "E08000037", "E08000021", "E08000022", "E08000023", "E08000024", "E06000008", "E06000009", "E06000049", "E06000050", "E06000006", "E06000007", "E07000026", "E07000027", "E07000028", "E07000029", "E07000030", "E07000031", "E08000001", "E08000002", "E08000003", "E08000004", "E08000005", "E08000006", "E08000007", "E08000008", "E08000009", "E08000010", "E07000117", "E07000118", "E07000119", "E07000120", "E07000121", "E07000122", "E07000123", "E07000124", "E07000125", "E07000126", "E07000127", "E07000128", "E08000011", "E08000012", "E08000014", "E08000013", "E08000015", "E06000011", "E06000010", "E06000012", "E06000013", "E06000014", "E07000163", "E07000164", "E07000165", "E07000166", "E07000167", "E07000168", "E07000169", "E08000016", "E08000017", "E08000018", "E08000019", "E08000032", "E08000033", "E08000034", "E08000035", "E08000036", "E06000015", "E06000016", "E06000018", "E06000017", "E07000032", "E07000033", "E07000034", "E07000035", "E07000036", "E07000037", "E07000038", "E07000039", "E07000129", "E07000130", "E07000131", "E07000132", "E07000133", "E07000134", "E07000135", "E07000136", "E07000137", "E07000138", "E07000139", "E07000140", "E07000141", "E07000142", "E07000170", "E07000171", "E07000172", "E07000173", "E07000174", "E07000175", "E07000176", "E06000019", "E06000051", "E06000021", "E06000020", "E07000192", "E07000193", "E07000194", "E07000195", "E07000196", "E07000197", "E07000198", "E07000199", "E07000218", "E07000219", "E07000220", "E07000221", "E07000222", "E08000025", "E08000026", "E08000027", "E08000028", "E08000029", "E08000030", "E08000031", "E07000234", "E07000235", "E07000236", "E07000237", "E07000238", "E07000239", "E06000055", "E06000056", "E06000032", "E06000031", "E06000033", "E06000034", "E07000008", "E07000009", "E07000010", "E07000011", "E07000012", "E07000066", "E07000067", "E07000068", "E07000069", "E07000070", "E07000071", "E07000072", "E07000073", "E07000074", "E07000075", "E07000076", "E07000077", "E07000095", "E07000096", "E07000242", "E07000098", "E07000099", "E07000240", "E07000243", "E07000102", "E07000103", "E07000241", "E07000143", "E07000144", "E07000145", "E07000146", "E07000147", "E07000148", "E07000149", "E07000200", "E07000202", "E07000203", "E09000007", "E09000012", "E09000013", "E09000014", "E09000019", "E09000020", "E09000022", "E09000023", "E09000025", "E09000028", "E09000030", "E09000032", "E09000001", "E09000033", "E09000002", "E09000003", "E09000004", "E09000005", "E09000006", "E09000008", "E09000009", "E09000010", "E09000011", "E09000015", "E09000016", "E09000017", "E09000018", "E09000021", "E09000024", "E09000026", "E09000027", "E09000029", "E09000031", "E06000036", "E06000043", "E06000046", "E06000035", "E06000042", "E06000044", "E06000038", "E06000039", "E06000045", "E06000037", "E06000040", "E06000041", "E07000061", "E07000062", "E07000063", "E07000064", "E07000065", "E07000084", "E07000085", "E07000086", "E07000087", "E07000088", "E07000089", "E07000090", "E07000091", "E07000092", "E07000093", "E07000094", "E07000105", "E07000106", "E07000107", "E07000108", "E07000109", "E07000110", "E07000111", "E07000112", "E07000113", "E07000114", "E07000115", "E07000116", "E07000177", "E07000178", "E07000179", "E07000180", "E07000181", "E07000207", "E07000208", "E07000209", "E07000210", "E07000211", "E07000212", "E07000213", "E07000214", "E07000215", "E07000216", "E07000217", "E07000223", "E07000224", "E07000225", "E07000226", "E07000227", "E07000228", "E07000229", "E06000022", "E06000023", "E06000052", "E06000024", "E06000026", "E06000025", "E06000030", "E06000027", "E06000054", "E07000040", "E07000041", "E07000042", "E07000043", "E07000044", "E07000045", "E07000046", "E07000047", "E07000078", "E07000079", "E07000080", "E07000081", "E07000082", "E07000083", "E07000187", "E07000188", "E07000189", "W06000001", "W06000002", "W06000003", "W06000004", "W06000005", "W06000006", "W06000023", "W06000008", "W06000009", "W06000010", "W06000011", "W06000012", "W06000013", "W06000014", "W06000015", "W06000016", "W06000024", "W06000018", "W06000019", "W06000020", "W06000021", "W06000022"]

	codeArr.forEach(thisCode => {
		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/"+thisCode+".json")
		.then(res => res.json())
		.then(json => {
				places.push(json);
		})
	})



    var topics;
    fetch("./archie.aml")
        .then((res) => res.text())
        .then((txt) => (topics = load(txt)))

	var puggy;
    fetch("./puggy.pug")
        .then((res) => res.text())
        .then((txt) => (puggy = txt))

	var loaded = false
    const onRosaeNlgLoad = () => { loaded = true }

	let grewSyn = {
		1: "expanded",
		2: "grew",
		3: "grew",
		4: "remained relatively stable",
		5: "fell"
	};

	var placesOb = [];
	var subplacesOb = [];

	function loadSubTopic(code) {
		if (code=="all") {
			loadTopic(selected.value)
		} else {
			code = selected.value + "_" + code
			console.log('codesub', code)
			subplacesOb = [];
			
			for (let i = 0; i < places.length; i++) {
				let story = places[i].stories.filter(d => (d.label==code))
				let s
				if (story.length>0) {
					s = story[0].label.split("_")
					if (s.length>4) {
						s[3] = s[3]+"_"+s[4]
						s.pop()
					}
				}
				let tmpOb = {
					'place': places[i],
					'story': story,
					'region': regions.find(d => d.code == places[i].parents[0].code),
					's': [s]
				}
				subplacesOb = [...subplacesOb, tmpOb]
			}
			for (let i = 0; i < subplacesOb.length; i++) {
				if (subplacesOb[i]['story'].length==0) {
					subplacesOb.splice(i,1)
					i = i-1
				}
			}
			let subplacesLow = subplacesOb.sort(function(a, b) { return a['story'][0]['value'] - b['story'][0]['value'] }).slice(0,3)
			let subplacesHigh = subplacesOb.sort(function(a, b) { return b['story'][0]['value'] - a['story'][0]['value'] }).slice(0,3)
			let subplacesMid = subplacesOb.sort(function(a, b) { return Math.abs(a['story'][0]['value']) - Math.abs(b['story'][0]['value']) }).slice(0,3)
			subplacesOb = subplacesHigh.concat(subplacesMid, subplacesLow)
			// placesOb=placesOb.slice(0,6)

			console.log('subplacesOb', subplacesOb)
			placesOb = subplacesOb
			placesOb = [...new Set(placesOb)]
		}
		loadedb = true
	}

	/// LOAD TOPIC
	function loadTopic(code) {
		console.log("code", code)

		placesOb = [];
		
		for (let i = 0; i < places.length; i++) {
			let story = places[i].stories.filter(d => (d.label.split("_")[0]+"_"+d.label.split("_")[1]+"_"+d.label.split("_")[2])==code)
			let s
			if (story.length>0) {
				s = story[0].label.split("_")
				if (s.length>4) {
					s[3] = s[3]+"_"+s[4]
					s.pop()
				}
			}

			console.log("thisReg", regions[2])
			
			let tmpOb = {
				'place': places[i],
				'story': story,
				'region': regions.find(d => d.code == places[i].parents[0].code),
				's': [s]
			}
			placesOb = [...placesOb, tmpOb]
		}
		for (let i = 0; i < placesOb.length; i++) {
			if (placesOb[i]['story'].length==0) {
				placesOb.splice(i,1)
				i = i-1
			}
		}

		let placesLow = placesOb.sort(function(a, b) { return a['story'][0]['value'] - b['story'][0]['value'] }).slice(0,3)
		let placesHigh = placesOb.sort(function(a, b) { return b['story'][0]['value'] - a['story'][0]['value'] }).slice(0,3)
		let placesMid = placesOb.sort(function(a, b) { return Math.abs(a['story'][0]['value']) - Math.abs(b['story'][0]['value']) }).slice(0,3)
		placesOb = placesHigh.concat(placesMid, placesLow)
		// placesOb=placesOb.slice(0,10)

		placesOb = [...new Set(placesOb)]
		console.log('places: sort ', placesOb)

		topic = true
	}

	function results(place, rgn, topicsIn, s, story) {
		console.log("RGNNin",rgn )

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

		function cap(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		
		return rosaenlg_en_US.render(puggy, {
			language: 'en_UK',
			place: place,
			data: place.data,
			eng: eng,
			rgn: rgn,
			parent: uncap1(regionThe(place.parents[0].name)),
			parentNT: uncap1(regionThe(place.parents[0].name, "NT")),
			s: s,
			stories: story,
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
			ord: ord,
			ageBandLU: ageBandLU,
		})

	}

	setTimeout(function() {
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
	}, 2000);

	$: subSel = subTopicOpt[selected.value]
	$: console.log('subTopicOpt', subSel)

	$: console.log('*****selected', selected)
	$: console.log('*****selectedb', selectedb)

</script>

<svelte:head>
	<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>

<div>
	<div style="width: 640px; margin: 50px auto;">
		<Select bind:selected options={topicOptions} placeholder="Search a topic" value="value" label="label" search={true} on:select="{() => { if (selected) { loadTopic(selected.value) }}}"/>
	</div>
</div>

<div>
	{#if topic}
		{#if loaded1}
			{#if loaded}
			{#if rgnLoad}
				{#if eng}	
					<div style="width: 640px; margin:0 auto;">
						<h1>{selected.label}</h1>
					</div>
					{#if subSel}
						<div>
							<div style="width: 640px; margin: 50px auto;">
								<Selectb bind:selectedb options={subSel} placeholder="Search a subtopic" value="value" label="label" search={true} on:select="{() => { if (selectedb) { loadSubTopic(selectedb.value) }}}"/>
							</div>
						</div>
						{#if loadedb}
							<div style="width: 640px; margin:0 auto;">
								<h1>{selectedb.label}</h1>
							</div>
						{/if}
					{/if}
					<main>
						{#each placesOb as item, i (i)}
							<h2 style="text-decoration: underline;">{item['place'].name}</h2>
							{@html results(item['place'], item['region'], topics, item['s'], item['story'])}
						{/each}
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
			{:else}
			<div style="padding: 50px; padding-left: 40%; font-size: x-large">Loading...</div>
	
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