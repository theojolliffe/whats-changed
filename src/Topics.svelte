<script>
	import { uds, adv, eq, udord, sign, nuword, ageBandLU, ord, uncap1, regionThe, drop, ud, otherRank, otherEst, qui, cha, cur, figs, get_word, city, chains, prev, getData} from "./utils";
	import Select from "./ui/Select.svelte";
	import Selectb from "./ui/SelectB.svelte";
	import { load } from "archieml"; //this is the parser from ArchieML to JSON
	import robojournalist from 'robojournalist';
	import pluralize from 'pluralize';
	import Fuse from 'fuse.js'
	var wal, selected, selectedb, quartiles, locRankCha, locRankCur, eng, rgncode, rgnLoad, natRankCha, natRankCur, topics, topic;
	var health, expand;
	var findst = false
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
	const findOne = (haystack, arr) => {
		return arr.some(v => haystack.includes(v));
	};
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
		{"label": "Welsh", "value": "welsh_perc_change"},
	]
	// Switch off when timeout function and change selected to agemed when not developing
	selected = topicOptions.find(d => d.value == "agemed_value_change")
	// setTimeout(function() {
	// 	loadTopic(selected.value)
	// }, 6000);
	var regionLU = {};
	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/Corresponding%20Local%20Authorities-Table%201.csv").then(res => {
		res.forEach(d => {
			regionLU[d['Name']] = d['Region/Country'];
		});
		console.log("regionLU", regionLU)
	});
	var countyLU = {};
	// Data load functions
	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/Local_Authority_District_to_County_(April_2021)_Lookup_in_England.csv").then(res => {
		res.forEach(d => {
			countyLU[d['LAD21NM']] = d['CTY21NM'];
		});
		console.log("countyLU", countyLU)
	});
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
			// {'label': 'Fair', 'value': 'fair'},
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
			// {'label': 'Buddhist', 'value': 'Buddhist'},
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
		'welsh_perc_change': false,
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
	fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/W92000004.json")
		.then(res => res.json())
		.then(json => {
			wal = json;
		})
	fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json")
		.then(res => res.json())
		.then(json => {
			eng = json;
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
			findst = true
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
	$: placesload = false
	$: console.log('placesload', placesload)
	setTimeout(function(){ placesload = true }, 1000);
    var topics;
    fetch("./archie.aml")
        .then((res) => res.text())
        .then((txt) => (topics = load(txt)))
	var puggy = `
// Population passes half a million
mixin subheadVal(i)
    if (Math.round(data[s[i][0]][s[i][1]][2001][s[i][3]]/1000) == Math.round(data[s[i][0]][s[i][1]][2011][s[i][3]]/1000))
        | Population plateaus
    else if (cha(s, place, i)<0)
        | Population drops
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<100000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>100000))
        | Population passes #[+value(100000)]
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<200000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>200000))
        | Population passes #[+value(200000)]
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<50000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>50000))
        | Population passes #[+value(50000)]
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<250000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>250000))
        | Population passes quarter of a million
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<500000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>500000))
        | Population passes half a million
    else if ((data[s[i][0]][s[i][1]]['2001'][s[i][3]]<1000000)&(data[s[i][0]][s[i][1]]['2011'][s[i][3]]>1000000))
        | Population passes a million
    else if ([250000, 500000, 1000000].includes(Number.parseFloat(Number.parseFloat(cur(s, place, i)).toPrecision(2))))
        | Population
        if (get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[0]=="just under")
            | nears 
        else
            | passes
        | #[+value(get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[1])]
    else
        | Population
        if ((cur(s, place, i)<(Number.parseFloat(Number.parseFloat(cur(s, place, i)).toPrecision(2)))))
            | nears
        else if (cur(s, place, i)>(Number.parseFloat(Number.parseFloat(cur(s, place, i))).toPrecision(2)))
            | passes
        else 
            | reaches
        |  #[+value(Number.parseFloat(Number.parseFloat(cur(s, place, i)).toPrecision(2)))]


// A younger Manchester
mixin subheadAge(i)
    | #[+value(ud(cha(s, place, i), place.name + ' grows older', 'A younger ' + place.name))]

mixin tenYears
  synz {mode:'sequence'}
    syn
      | in the decade to 2021
    syn
      | between the last two censuses
    syn
      | in the 10 years leading up to 2021
    syn
      | in the decade leading up to the last census
    syn
      | in the 10 years leading up to the last census

// Between the last two censuses, the average age in Manchester fell by two years, from 34 to 32 years of age.
mixin sent1Age(i)
    p
        | Census 2021 data also shows a #[+value(topics[s[i][0]].synonym)].
        p
            | Between the last two censuses, the median age
            | of #[+value(place.name)] 
            | #[+value(ud(cha(s, place, i), 'rose by', 'fell by'))]
            | #[+value(Math.abs(cha(s, place, i)), {'TEXTUAL':true })] 
            | #[+value(Math.abs(cha(s, place, i))==1?'year':'years')],
            | from #[+value(data[s[i][0]][s[i][1]][2001][s[i][3]])]
            | to #[+value(data[s[i][0]][s[i][1]][2011][s[i][3]])] years of age.

// Manchester's average age is the lowest in the North West and remains considerably lower than the average age across England (38 years of age).
mixin sent2Age(i)        
    - let lra = data[s[i][0]][s[i][1]+"_rank_local"][2011][s[i][3]]
    - let agediff = data[s[i][0]][s[i][1]][2011][s[i][3]]-cou.data.agemed.value[2011].all
    - let agediff01 = data[s[i][0]][s[i][1]][2001][s[i][3]]-cou.data.agemed.value[2001].all
    if (country=="England")
        | This #[+value((place.classification!='unk')?place.classification:'area')] has 
        if (Math.abs(lra)<4)
            | the #[+value(ud(lra, ord(lra) + "highest", ord(lra) + "lowest"))]
            | average age in #[+value(parent)] and 
        else
            | a #[+value(adv(cur(s, place, i), cur(s, rgn, i)))] 
            | #[+value(ud(cur(s, place, i)-cur(s, rgn, i), 'higher', 'lower'))]
            | average age than #[+value(parent)] and
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]==eng.data.agemed.value[2011].all)
            | has a similar age to the average local authority area across England (#[+value(eng.data.agemed.value[2011].all)] years of age).
        else
            | #[+value((Math.sign(agediff) == Math.sign(agediff01)?'remains':'has become'))] 
            | #[+value(Math.abs(agediff)>4?'': Math.abs(agediff)>2?'somewhat':'slightly')] 
            | #[+value(ud(agediff, 'older', 'younger'))] 
            | than the average local authority area across England (#[+value(eng.data.agemed.value[2011].all)] years of age).
    else
        | This #[+value((place.classification!='unk')?place.classification:'area')] has
        | a #[+value(adv(cur(s, place, i), cur(s, simi, i)))] 
        | #[+value(ud(cur(s, place, i)-cur(s, simi, i), 'higher', 'lower'))]
        | average age than #[+similarname] (#[+value(cur(s, simi, i))] years of age) and
        if (Math.abs(lra)<4)
            | the #[+value(ud(lra, ord(lra) + "highest", ord(lra) + "lowest"))]
            | average age in #[+value(parent)].
        else if (cur(s, place, i)==cur(s, rgn, i))
            | has a similar age to the average local authority area across Wales (#[+value(rgn.data.agemed.value[2011].all)] years of age).
        else
            | #[+value((Math.sign(agediff) == Math.sign(agediff01)?'remains':'has become'))] 
            | #[+value(Math.abs(agediff)>4?'': Math.abs(agediff)>2?'somewhat':'slightly')] 
            | #[+value(ud(agediff, 'older', 'younger'))] 
            | than the average local authority area across Wales (#[+value(rgn.data.agemed.value[2011].all)] years of age).


// The drop in age was largely driven by an increase of nearly 50,000 people between the ages of 20 and 29 years, while the population over the age of 70 years decreased by almost two thousand.
mixin sent3Age(i)
    - let agediff = data[s[i][0]][s[i][1]][2011][s[i][3]]-cou.data.agemed.value[2011].all
    | The #[+value(ud(agediff, 'rise', 'drop'))] in age was because of an increase of 
    | #[+value(figs(data.age10yr.absChange['pos'][0][1])[0])]  
    | #[+value(figs(data.age10yr.absChange['pos'][0][1])[1])]  
    | #[+value(ageBandLU[data.age10yr.absChange['pos'][0][0]][0])]
    if (data.age10yr.absChange['neg'][0])
        | , while the population #[+value(ageBandLU[data.age10yr.absChange['neg'][0][0]][1])] decreased by 
        | #[+value(figs(data.age10yr.absChange['neg'][0][1])[0])]  
        | #[+value(Math.abs(figs(data.age10yr.absChange['neg'][0][1])[1]))]  
    | . 

mixin rou(x)
    if (Math.abs(x)<10)
        | #[+value(Math.round(x*10)/10)]
    else 
        | #[+value(Math.round(x))]

mixin pc(x)
    if (Math.abs(x)<10)
        | #[+value((x/100), {'FORMAT': '0.0%'})]
    else 
        | #[+value((x/100), {'FORMAT': '0%'})] 

// In the decade to 2021, the population of Manchester rose by over 28% from 391,221 to 503,127, giving it the largest headcount of any local authority area in the North West of England.
mixin sent1pop(i)
    | #[+tenYears],
    | the population
    | of #[+value(place.name)]
    if (Math.round(data[s[i][0]][s[i][1]][2001][s[i][3]]/1000) == Math.round(data[s[i][0]][s[i][1]][2011][s[i][3]]/1000))
        | remained close to #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]], 3)[1])].
    else
        | #[+value(ud(cha(s, place, i), 'rose', 'fell by'))]
        | #[+pc(Math.abs(data[s[i][0]][s[i][1]]['change'][s[i][3]]))],
        | from #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]], 3)[0])]
        | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]], 3)[1])]
        | to #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]], 3)[1])].

mixin geog 
    if (country=="Wales")
        | Wales
    else
        | #[+value((parent=="London")?"Greater London":"the region")]

// The addition of over 100,000 people means Manchester's population is also the fastest-growing in the North West and the second-fastest-growing across England. Only Tower Hamlets in London, with an increase of almost 30%, has a faster-growing population.
mixin sent2pop(i)
    - var lra = data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]]
    | The 
    | #[+value(ud(cha(s, place, i), "addition", "loss"))]
    | of about
    | #[+value(Math.abs(figs(data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]], "num")[1]))]
    | people means this area's population
    //- If population decreased but not at a high rank
    if ((cha(s, place, i)<0)&(Math.abs(lra)>3))
        | decreased by #[+pc(Math.abs(cha(s, place, i)))] between that last two censuses, 
        | while the population of !{cou.name} increased by #[+pc(Math.abs(cha(s, cou, i)))]
    else
        | is
        if (rgn.name!='Wales')
            if ((Math.abs(lra)<4) & (sign(lra, cha(s, place, i))))
                | the #[+value(ud(lra, (ord(Math.abs(lra))+"fastest-growing"), (ord(Math.abs(lra))+"most rapidly-declining")))]
                | in !{parent}
                | #[+value((Math.sign(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]])!=(Math.sign(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])))?"but":"and")]
            if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]])<6)
                if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]])>1)
                    | the #[+value(Math.abs(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]]), {'ORDINAL_TEXTUAL':true})]
                | #[+value(ud(cha(s, place, i), 'fastest-growing', 'most rapidly-declining'))]
                | across 
                | #[+value(country)].
            else
                if (place.stories[i].value<(eng.data[s[i][0]][s[i][1]]['change'][s[i][3]]-1))
                    | increasing at a slower rate than the total population of 
                else if (place.stories[i].value>(eng.data[s[i][0]][s[i][1]]['change'][s[i][3]]+1))
                    | increasing faster than the rate of growth across 
                else
                    | increasing at a similar rate to the overall population of
                | #[+value(country)] (#[+value((cha(s, place, i)==cha(s, eng, i))?'also':'')]
                | up #[+pc(eng.data[s[i][0]][s[i][1]]['change'][s[i][3]])] since the 2011 census).
        else
            if ((Math.abs(lra)<4) & (sign(lra, cha(s, place, i))))
                | the #[+value(ud(lra, (ord(Math.abs(lra))+"fastest-growing"), (ord(Math.abs(lra))+"most rapidly-declining")))]
                | in #[+geog]
                | , while #[+value(place.name)] #[+value(data.population.value_rank[2011].all==data.population.value_rank[2001].all?"remains":"becomes")] the 
                | #[+value(udord(data.population.value_rank[2011].all, "most", "least"))] populous
                | local authority area in the country. 
            else
                if (place.stories[i].value<(rgn.data[s[i][0]][s[i][1]]['change'][s[i][3]]-1))
                    | increasing at a slower rate than the total population of 
                else if (place.stories[i].value>(rgn.data[s[i][0]][s[i][1]]['change'][s[i][3]]+1))
                    | increasing faster than the rate of growth across 
                else
                    | increasing at a similar rate to the overall population of
                | Wales (
                | #[+value((cha(s, place, i)==cha(s, rgn, i))?'also':'')]
                |up #[+pc(rgn.data[s[i][0]][s[i][1]]['change'][s[i][3]])] since the 2011 census).

mixin val(x)
    if (Math.abs(x)<10)
        | #[+value(x, {'FORMAT': '0.0'})]
    else
        | #[+value(x, {'FORMAT': '0'})] 

// For each football pitch-sized piece of land (about 7,140 square metres), Manchester is now home to, on average, about 31 people, compared to 24 in 2011.
mixin density 
    if (rgn.name=='Wales')
        - country = 'Wales'
    - let ppfp = Number.parseFloat(Number.parseFloat(0.714*data.density.value[2011].all).toPrecision(2))
    if (ppfp==ppfp)
        | #[+value(place.name)] is home to, on average, #[+value(ppfp)] #[+value(pluralize('person', ppfp))] per football pitch-sized piece of land (about #[+value(7140)] square metres).
    else
        | #[+value(place.name)] is now home to, on average, 
        | #[+value(ppfp)] #[+value(pluralize('person', ppfp))]
        | per football pitch-sized piece of land (about #[+value(7140)] square metres), compared to 
        | #[+value(Number.parseFloat(Number.parseFloat(0.714*data.density.value[2001].all).toPrecision(2)))] in 2011.
    if (Math.abs(data.density.value_rank[2011].all)==1)
        | This makes it #[+value(country)]'s #[+value(udord(data.density.value_rank[2011].all, "most densely-populated", "least densely-populated"))] #[+value(place.gss.short)].
    else if (Math.abs(data.density.value_rank_local[2011].all)==1)
        | This makes it #[+value(parent)]'s #[+value(udord(data.density.value_rank_local[2011].all, "most densely-populated", "least densely-populated"))] #[+value(place.gss.short)].
    else if (Math.abs(data.density.value_rank[2011].all)<4)
        | This makes it #[+value(country)]'s #[+value(udord(data.density.value_rank[2011].all, "most densely-populated", "least densely-populated"))] #[+value(place.gss.short)].
    else if (Math.abs(data.density.value_rank_local[2011].all)<4)
        | This makes it #[+value(parent)]'s #[+value(udord(data.density.value_rank_local[2011].all, "most densely-populated", "least densely-populated"))] #[+value(place.gss.short)].

// Between 2011 and 2021, Manchester overtook Wiltshire and Liverpool to become England's eighth-most populated local authority.
mixin sent4Pop(i)
    | Between 2011 and 2021, this #[+value(place.gss.short)] overtook 
    if (data['density'][s[i][1]+'_rank']['overtake'][s[i][3]].length<4)
        eachz item in data['density'][s[i][1]+'_rank']['overtake'][s[i][3]] with { separator: ',', last_separator: 'and' }
            | #{item}
    else if (data['density'][s[i][1]+'_rank']['overtake'][s[i][3]].length>3)
        | #[+value(data['density'][s[i][1]+'_rank']['overtake'][s[i][3]].length)] areas, 
        | including #[+value(data['density'][s[i][1]+'_rank']['overtake'][s[i][3]][0])] 
        | and #[+value(data['density'][s[i][1]+'_rank']['overtake'][s[i][3]][1])],
    | to become England's #[+value(Math.abs(data.density.value_rank[2011].all), {'ORDINAL_TEXTUAL':true})]
    | most densely populated local authority area.


mixin overtake(i, loc)
    | During this period, !{place.name} 
    if (rgn.name=='Wales')
        - loc = "_local"
    - var ove = data[s[i][0]][s[i][1]+"_rank"+loc]['overtake'][s[i][3]]
    - var ra = data[s[i][0]][s[i][1]+"_rank"+loc][2011][s[i][3]]
    if (Math.abs(ra)<11)
        | #[+value(ud(ra, 'overtook', 'fell below'))] 
        if (ove.length<4)
            eachz item in ove with { separator: ',', last_separator: 'and' }
                | #{item}
        else if (ove.length>3)
            | #[+value(nuword(ove.length))] 
            | local authorities, 
            | including #[+value(ove[0])] 
            | and #[+value(ove[1])],
        | to become the #[+value((loc == "_local") ? parentNT : (country=="Wales")?"Welsh":"English")] local authority area with the
        | #[+value(ud(ra, (ord(Math.abs(ra))+"highest"), (ord(Math.abs(ra))+"lowest")))]
        | percentage of #[+value(topics[s[i][0]][s[i][3]].adj_noun_s)].
    else
        | went from having the
        | #[+value(ord(Math.abs(data[s[i][0]][s[i][1]+"_rank"+loc][2001][s[i][3]]))+ud(data[s[i][0]][s[i][1]+"_rank"+loc][2001][s[i][3]],"highest", "lowest"))]
        | to the #[+value(ud(ra, (ord(Math.abs(ra))+"highest"), (ord(Math.abs(ra))+"lowest")))] percentage of #[+value(topics[s[i][0]][s[i][3]].adj_noun_s)] out of 
        | #[+value((country=="England")?"309 English":"22 Welsh")] local authorities.

//- mixin percOfRes(place)
//-     synz {mode:'sequence'}
//-         syn
//-             | the percentage of #[+value(place.name)] residents
//-         syn
//-             | the percentage of people living in #[+value(place.name)] 

// In the 10 years leading up to the last census, the percentage of Manchester residents describing their health as good increased from just over 66% to about 80%.
mixin sent1Perc(i)
    if (i==1)
        p Census 2021 data also shows a #[+value(topics[s[i][0]].synonym)].
    p the percentage of
        | #[+value(topic(i).clausal_modifier)] 
        if (cha(s, place, i)<0)
            | decreased
        else
            | increased 
        | from 
        | #[+pc(data[s[i][0]][s[i][1]][2001][s[i][3]])]
        if (i==1)
            | in 2011
        | to 
        | #[+pc(cur(s, place, i))] 
        if (i!=1)
            | #[+tenYears]
        | .

// About one in eight (13%) described their health as fair, compared with just over 23% in 2011. The percentage reporting bad health decreased from just under 13% to just over 7%.
mixin sent2Perc(i, chain0_01, chain0_11, chain1_01, chain1_11)
    if (Math.round(chain0_01)==Math.round(chain0_11))
        | The proportion 
        | #[+value((topics[s[i][0]].measure_s=='households')?'that':'who')] 
        | #[+value(topic(i, chains[s[i][3]][0]).verb_past_samp)]
        | remained close to #[+pc(chain0_01)], while
    else
        | In 2021,
        if (data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]]<1.7)
            | #[+pc(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])] of
        else 
            | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[0])]
            | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[1])]
            | (#[+pc(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])])
        | #[+value(topics[s[i][0]].measure_s)]
        | #[+value(topic(i, chains[s[i][3]][0]).verb_past_samp)],
        | compared with
        | #[+pc(chain0_01)]
        | in 2011. 
    if (chains[s[i][3]].length>1)
        | the percentage of
        | #[+value(topic(i, chains[s[i][3]][1]).clausal_modifier)] 
        | #[+value(ud(chain1_11-chain1_01, 'increased', 'decreased'))]
        | from 
        | #[+pc(chain1_01)]
        | to 
        | #[+pc(chain1_11)]
        | .

mixin inRegion
    synz {mode:'sequence'}
        syn 
            | in any other local authority district across
        syn
            | anywhere else in

// The proportion of healthy residents in Manchester is growing at the third fastest rate of all local authority disricts across England.
// The population of Manchester is becoming more healthy at the third fastest of all local authority districts across England.
mixin topRank(i)
    | The proportion of #[+value(topic(i).adj_noun)] is 
    | #[+value(ud(cha(s, place, i, "r"), 'growing', 'falling'))]
    if (Math.abs(cha(s, place, i, "r"))==1)
        | faster here than #[+inRegion] #[+value(country)]
    else 
        | at the third fastest rate of all local authority districts across #[+value(country)]
    if ((Math.abs(otherRank(s, place, i, 'cou'))==1)&(!hasSaid('OtherChange')))
        | , while the percentage of 
        | #[+value(topic(i, otherEst(s, place, i, cha(s, place, i, "r"), 'change')).adj_noun)] is 
        | #[+value(ud(otherRank(s, place, i, 'cou'), 'increasing', 'decreasing'))]
        | faster than anywhere else in the #[+value(city)].
        if ((i!=hiRank.rankIn)&(s[i][0]!='health'))
            p #[+nowHasReg(i)] 
        recordSaid('OtherChange')
    else
        | .
        if (Math.abs(cur(s, place, i, "r"))<11)
            | #[+nowHasCou(i)]
        else
            | #[+considImprov(i)]

// The proportion of healthy residents is increasing faster here than in any other local authority district across the region.
mixin topRankLoc(i)
    | The proportion of #[+value(topic(i).adj_noun)] is 
    if (cha(s, place, i, "rl")<0)
        | decreasing
    else
        | increasing
    | faster here than #[+inRegion] #[+value(parent)]
    if ((Math.abs(otherRank(s, place, i, "rl"))==1)&(!hasSaid('OtherChange')))
        | , while the percentage of 
        | #[+value(topic(i, otherEst(s, place, i, cha(s, place, i, "rl"), 'change')).adj_noun)] is 
        | #[+value(ud(otherRank(s, place, i, "rl"), 'growing', 'falling'))]
        | faster than anywhere else in the #[+value(city)]
        if ((i!=hiRank.rankIn)&(s[i][0]!='health'))
            p #[+nowHasReg(i)] 
        recordSaid('OtherChange')
    else
        | .
        if (Math.abs(cur(s, place, i, "rl"))<4)
            | As a result, #[+nowHasReg(i)]
            if ((i!=hiRank.rankIn)&(s[i][0]!='health'))
                p #[+nextHighest(i)]
        else
            | #[+considImprov(i)]

// This mixin determines how the rest of the section will be generated
mixin sent3Perc(i)
    if (Math.abs(cha(s, place, i, "r"))<4)
        | #[+topRank(i)]
    else if (Math.abs(cha(s, place, i, "rl"))==1)
        | #[+topRankLoc(i)] 
    else
        | The proportion of  #[+value(topic(i).adj_noun)] has been
        | #[+value(ud(cha(s, place, i), 'growing', 'falling'))]
        if (country=="England")
            if ((cha(s, place, i)>cha(s, near, i)-1)&(cha(s, place, i)<cha(s, near, i)+1))
                | at a similar rate to 
            else
                | #[+value(uds((Math.abs(cha(s, place, i)) - Math.abs(cha(s, rgn, i))), 'faster here than', 'at a slower rate here than', 'here at a similar rate to'))]
            | the figure for the whole of #[+value(parent)]
            | (from #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] in 2011 to 
            | #[+pc((cur(s, rgn, i)))] in 2021)
            if ((sign(Math.abs(cha(s, place, i))-Math.abs(cha(s, rgn, i))), sign(Math.abs(cha(s, place, i))-Math.abs(cha(s, eng, i)))))
                | and across #[+value(country)] 
                | (from #[+pc((eng.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
                | #[+pc((eng.data[s[i][0]][s[i][1]][2011][s[i][3]]))]).
            else
                | . Across #[+value(country)], the proportion #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))]
                | from #[+pc((eng.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
                | #[+pc((eng.data[s[i][0]][s[i][1]][2011][s[i][3]]))].
        else
            if ((cha(s, place, i)>cha(s, near, i)-1)&(cha(s, place, i)<cha(s, near, i)+1))
                | at a similar rate to 
            else
                | #[+value(ud(Math.abs(cha(s, place, i))-Math.abs(cha(s, near, i)), 'faster', 'at a slower rate'))]
                | here than in 
            | #[+nearbyname]
            | (from #[+pc((near.data[s[i][0]][s[i][1]][2001][s[i][3]]))] in 2011 to 
            | #[+pc((near.data[s[i][0]][s[i][1]][2011][s[i][3]]))] in 2021)
            if ((sign(Math.abs(cha(s, place, i))-Math.abs(cha(s, near, i))), sign(Math.abs(cha(s, place, i))-Math.abs(cha(s, rgn, i)))))
                | and across #[+value(parent)]
                | (from #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
                | #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))]) .
            else 
                | . Across Wales, the proportion #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))]
                | from #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
                | #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))].

// Blackburn with Darwen has the region's next lowest proportion of residents from a White ethnic group (69.2%), while 90.1% in nearby Salford are from a White ethnic group.
mixin nextHighest(i)
    if (cur(s, place, i, "rl")<0)
        | #[+value(data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].above.name)] 
        | has the region's next lowest proportion of 
        | #[+value(topic(i).adj_noun)]
        | (#[+pc((data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].above.value))]), 
    else
        | #[+value(data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].below.name)] 
        | has the region's next highest proportion of 
        | #[+value(topic(i).adj_noun)]
        | (#[+pc((data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].below.value))]),
    | while the proportion is
    | #[+pc((near.data[s[i][0]][s[i][1]][2011][s[i][3]]))]
    | in #[+value(near.name)].

// As a result, this area now has the country's highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasCou(i)
    | As a result, this area now has the country's 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]])!=1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]]<0)
        | lowest
    else
        | highest 
    | proportion of 
    | #[+value(topic(i).adj_noun)]
    | and the lowest proportion of homeowners
    | .

// As a result, this area now has the region’s highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasReg(i)
    | this area now has 
    if (parent=="London")
        | Greater London's
    else
        | the region’s 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]])!=1)
        | #[+value(Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]]), {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]]<0)
        | lowest proportion of #[+value(topic(i).adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(s, place, i, 'highest', '2011')]==1)
            | and the 
            | highest proportion of 
            | #[+value(topic(i, otherEst(s, place, i, 'highest', '2011')).adj_noun)]
    else
        | highest proportion of #[+value(topic(i).adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(s, place, i, 'lowest', '2011')]==-1)
            | and the 
            | lowest proportion of
            | #[+value(topic(i, otherEst(s, place, i, 'lowest', '2011')).adj_noun)]
    | .

// The considerable improvement has brought health in Manchester close to the national average (about 81% in England described their health as good in 2021).
mixin considImprov(i)
    if (data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]]==1)
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than
        else
            | The improvement has brought health in 
            | #[+value(place.name)] close to 
        | the national average
        | #[+pc(eng.data[s[i][0]][s[i][1]][2011][s[i][3]])]
        | in #[+value(country)] described their health as good in 2021).
    else
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than   
        else
            | The improvement has brought health in 
            | #[+value(place.name)] close to 
        | the regional average
        | #[+pc(rgn.data[s[i][0]][s[i][1]][2011][s[i][3]])]
        | in #[+value(parent)] described their health as good in 2021).

mixin healthExplain
    | These data are people’s own opinions in describing their overall health. They may be inconsistent with other measures of health, such as NHS records.

//- The rate of self-employment rose in Darlington, but at a slower rate than all other local authorities in the the North East.
//- Private renting rose in Maldon, but at a slower rate than all other local authorities in East England, except Luton and Watford.
mixin butSlower(i, loc)
    p 
        | #[+value(topic(i, s[i][3]).sample)] 
        | #[+value(ud(cha(s, place, i), 'rose', 'fell'))]
        | in #[+value(place.name)], but at
        if (data[s[i][0]][s[i][1]+'_rank'+loc][s[i][2]][s[i][3]]>3)|(rgn.name=="Wales")
            - loc = "_local"
        if (data[s[i][0]][s[i][1]+'_rank'+loc][s[i][2]][s[i][3]]>3)
            | the #[+value(ord(data[s[i][0]][s[i][1]+'_rank'+loc][s[i][2]][s[i][3]]))] 
            | slowest rate of any local authority are across #[+value(country)]. 
        else
            | a slower rate than all other
            | #[+value((loc!="_local")? ("local authority areas across " + country): (parent=="London")? place.gss.long+"s" :"local authorities in "+parent)]
            if (Math.abs(data[s[i][0]][s[i][1]+'_rank'+loc][s[i][2]][s[i][3]])!=1)
                | , except #[+value(data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][1].name)]
                if (Math.abs(data[s[i][0]][s[i][1]+'_rank'+loc][s[i][2]][s[i][3]])!=2)
                    | and #[+value(data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][2].name)] 
        | .


mixin rank1reg(i)
    // In the rare occasion that the bottom rank is a positive change, vice versa
    if (Math.sign(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]]) != Math.sign(cha(s, place, i)))
        | #[+butSlower(i, "_local")]
    else
        | This area saw #[+value(parent)]'s 
        | #[+value(drop(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]], 'largest drop', 'largest rise'))]
        | in the proportion of #[+value(topic(i, s[i][3]).adj_noun)].
        p #[+acrossRegion(i)]

//- This district saw England's second-largest drop in the proportion of people who describe themselves as Christian.
mixin rank1nat(i)
    // In the rare occasion that the bottom rank is a positive change, vice versa
    if (Math.sign(data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]]) != Math.sign(cha(s, place, i)))
        | #[+butSlower(i, "")]
    else
        | This area saw #[+value(country)]'s 
        | #[+value(drop(data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]], 'largest drop', 'largest rise'))]
        | in the proportion of #[+value(topic(i, s[i][3]).adj_noun)].
        p #[+acrossCountry(i)]

mixin rank2(i)
    | In 2021,
    if (data[s[i][0]][s[i][1]][2011][s[i][3]]<1.7)
        | #[+pc(data[s[i][0]][s[i][1]][2011][s[i][3]])] of
    else 
        | #[+value(get_word((data[s[i][0]][s[i][1]][2011][s[i][3]])/100, 'frac')[0])]
        | #[+value(get_word((data[s[i][0]][s[i][1]][2011][s[i][3]])/100, 'frac')[1])]
        | (#[+pc(data[s[i][0]][s[i][1]][2011][s[i][3]])])
    | #[+value(topics[s[i][0]].measure_s)] in !{place.name}
    | #[+value(topic(i, s[i][3]).verb_past_samp)],
    | compared with
    | #[+pc(data[s[i][0]][s[i][1]][2001][s[i][3]])]
    | in 2011. 
    | The percentage
    | #[+value(topic(i, chains[s[i][3]][0]).verb)] 
    if (data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]]>data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])
        | decreased 
    else
        | increased
    | from 
    | #[+pc(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])]
    | to 
    | #[+pc(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])]
    | .

mixin regional 
    if (parent=="Wales")
        | Welsh
    else
        | regional

mixin region
    if (parent=="Wales")
        | Wales
    else if (parent=="London")
        | Greater London
    else
        | the region

//- Across the North East, Manchester (from 50% in 2011 to 30% in 2021) saw the next greatest drop in the proportion of people working long hours, while the regional average decreased from 40% to 20%.
mixin acrossRegion(i)
    | Across the region, 
    - var rl = data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]]
    if (Math.abs(rl)==1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local'].top_bottom[s[i][3]][rl<0?"-2":"2"].name)] 
        | #[+county(data[s[i][0]][s[i][1]+'_rank_local'].top_bottom[s[i][3]][rl<0?"-2":"2"].name)]
        | saw the next greatest #[+value([rl<0?"decrease":"increase"])] in the proportion of #[+value(topic(i).adj_noun)]
        | (from #[+pc((data[s[i][0]][s[i][1]+'_rank_local'].top_bottom[s[i][3]][rl<0?"-2":"2"][2001]))] in 2011 
        | to #[+pc((data[s[i][0]][s[i][1]+'_rank_local'].top_bottom[s[i][3]][rl<0?"-2":"2"][2011]))] in 2021) 
        | .
    else if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]])==2)
        | only 
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['name'])]
        | saw a greater #[+value((rl<0)?'fall':'rise')] in the proportion of #[+value(topic(i).adj_noun)]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['2011']))]) 
        | .
    else if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]])==3)
        | only 
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['name'])]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-1":"1"]['2011']))]) 
        | and 
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-2":"2"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-2":"2"]['name'])]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-2":"2"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank_local']['top_bottom'][s[i][3]][(rl<0)?"-2":"2"]['2011']))]) 
        | saw a greater #[+value(cha(s, place, i)<0?"decrease":"increase")] in the proportion of #[+value(topic(i).adj_noun)].

//- Across the North East, the proportion of self-employed people rose from 10% in 2011 to 15% in 2021, while the proportion in nearby Middlesborough rose from 11% to 14%.
mixin acrossRegionExcept(i)
    | Across #[+value(parent)], the proportion of #[+value(topic(i).adj_noun)]
    | #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))]
    | from #[+pc((rgn.data[s[i][0]][s[i][1]]['2001'][s[i][3]]))] to 
    | #[+pc((rgn.data[s[i][0]][s[i][1]]['2011'][s[i][3]]))] between the last two censuses,
    | while the proportion in #[+nearbyname]
    | #[+value(ud(cha(s, near, i), 'rose', 'fell'))]
    | from #[+pc((near.data[s[i][0]][s[i][1]]['2001'][s[i][3]]))] to 
    | #[+pc((near.data[s[i][0]][s[i][1]]['2011'][s[i][3]]))].

mixin county(p)
    if (countyLU[p])
        if (fuzz(countyLU[p], p))
            if (countyLU[p]!=countyLU[place.name])
                | in #[+value(countyLU[p])]
        else if ((regionLU[p])&(regionLU[place.name]))
            if (regionLU[p]!=regionLU[place.name])
                | in #[+value(uncap1(regionThe(regionLU[p])))]
    else if (regionLU[p]&(regionLU[place.name]))
        if (regionLU[p]!=regionLU[place.name])
            | in #[+value(uncap1(regionThe(regionLU[p])))]


mixin acrossCountry(i)
    - let loc
    if (rgn.name=='Wales')
        - loc = "_local"
    else 
        - loc = ""
    - var r = data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]]
    if (Math.abs(r)==1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][r<0?"-2":"2"].name)] 
        | #[+county(data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][r<0?"-2":"2"].name)]
        | saw the next greatest #[+value((r<0)?"drop":"rise")]
        | (from #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][r<0?"-2":"2"][2001]))] 
        | to #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc].top_bottom[s[i][3]][r<0?"-2":"2"][2011]))])
        | .
    else if (Math.abs(data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]])==2)
        | The greatest #[+value((r<0)?"decrease":"increase")] occurred in 
        | #[+value(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['name'])]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['2011']))]) 
        | .
    else if (Math.abs(data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]])==3)
        | The greatest #[+value((r<0)?"decrease":"increase")] occurred in 
        | #[+value(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['name'])]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-1":"1"]['2011']))]) 
        | followed by
        | #[+value(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-2":"2"]['name'])]
        | #[+county(data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-2":"2"]['name'])]
        | (from 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-2":"2"]['2001']))] to 
        | #[+pc((data[s[i][0]][s[i][1]+'_rank'+loc]['top_bottom'][s[i][3]][r<0?"-2":"2"]['2011']))]).

mixin despiteRegion(i)
    | Despite the shift in #[+value(topics[s[i][0]].general)], #[+value(place.name)] still has #[+value(parent)]'s 
    | #[+value(udord(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]], 'highest propotion', 'lowest propotion'))]
    | of #[+value(topic(i)['adj_noun'])], 
    | behind
    | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['above_below'][s[i][3]].above.name)]
    | (#[+pc(data[s[i][0]][s[i][1]+'_rank_local']['above_below'][s[i][3]].above.value)]).

mixin despiteCountry(i)
    | Despite the shift in #[+value(topics[s[i][0]].general)], #[+value(place.name)] still has #[+value(country)]'s 
    | #[+value(udord(data[s[i][0]][s[i][1]+'_rank'][s[i][2]][s[i][3]], 'highest propotion', 'lowest propotion'))]
    | of #[+value(topic(i)['adj_noun'])], 
    | behind 
    | #[+value(data[s[i][0]][s[i][1]+'_rank']['above_below'][s[i][3]].above.name)]
    | (#[+pc(data[s[i][0]][s[i][1]+'_rank']['above_below'][s[i][3]].above.value)]).

mixin ppoint
    if !hasSaid('PP')
        | percentage points (pp)
        recordSaid('PP')
    else
        | pp

mixin sent2Diff(i, chain0_01, chain0_11, chain1_01, chain1_11)
    | #[+value(topic(i, chains[s[i][3]][0]).sample)] in 
    | #[+value(place.name)]
    if (Math.round(chain0_11)==Math.round(chain0_01))
        | remained close to #[+pc((chain0_11))]
    else
        | #[+value(ud(chain0_11-chain0_01, 'rose', 'fell'))]
        | from 
        | #[+pc(chain0_01)]
        | to 
        | #[+pc(chain0_11)]
    if (chains[s[i][3]].length>1)
        | , while #[+value(topic(i, chains[s[i][3]][1]).sample)]
        if (Math.round(chain1_11*10)/10==Math.round(chain1_01*10)/10)
            | remained close to #[+pc((chain1_11))]
        else
            | #[+value(ud(chain1_11-chain1_01, 'increased', 'decreased'))]
            | from 
            | #[+pc(chain1_01)]
            | to 
            | #[+pc(chain1_11)]
    | .

//- The percentage of residents from a Black ethnic group changed very little in Lambeth, while the proportion rose across London.
mixin difference(i, chain0_01, chain0_11, chain1_01, chain1_11)
    | The percentage of #[+value(topic(i).adj_noun)] 
    if (Math.abs(cha(s, place, i))<1)
        | changed very little
        //- if ((cur(s, place, i)-cur(s, eng, i))<-2)
        //-     if ((prev(s, place, i)-prev(s, eng, i))<0)
        //-         | remained lower than average
        //-     else
        //-         | became lower the average
        //- else if ((cur(s, place, i)-cur(s, eng, i))>2)
        //-     if ((prev(s, place, i)-prev(s, eng, i))>0)
        //-         | remained higher than average
        //-     else
        //-         | became higher than average
        //- else 
        //-     if ((prev(s, place, i)-prev(s, eng, i))>2)|((prev(s, place, i)-prev(s, eng, i))<-2)
        //-         | became close to average
        //-     else
        //-         | remained close to average 
    else
        | is #[+value(ud(cha(s, place, i), 'rising', 'falling'))] 
    synz {mode:'sequence'}
        syn
            | in #[+value(place.name)]
        syn
            | here
        syn
            | in this #[+value((place.classification!='unk')?place.classification:'area')]
        syn
            | in this area
    - var curDif
    if ((stories[i].type.includes('nearDiff'))&(!hasSaid('nearDiff'))|(eq(stories[i].type, ['nearDiff'])))
        recordSaid('nearDiff')
        - curDif = 'nearDiff'
        if (Math.abs(cha(s, place, i))<1)
            | , while the proportion #[+value(ud(cha(s, near, i), 'rose', 'fell'))] in
        else
            if (Math.abs(cha(s, place, i)) < Math.abs(cha(s, near, i)))
                | , but at a slower rate than in
            else
                | at a faster rate than in
        | #[+nearbyname].
    else if ((stories[i].type.includes('simiDiff'))&(!hasSaid('simiDiff'))|(eq(stories[i].type, ['simiDiff'])))
        recordSaid('simiDiff')
        - curDif = 'simiDiff'
        if (Math.abs(cha(s, place, i))<1)
            | , while the proportion #[+value(ud(cha(s, place.similar, i), 'rose', 'fell'))] in
        else
            if (Math.abs(cha(s, place, i)) < Math.abs(cha(s, place.similar, i)))
                | , but at a slower rate than in
            else
                | at a faster rate than in
        | #[+similarname].
    else if (stories[i].type.includes('regDiff')&(!hasSaid('regDiff'))|(eq(stories[i].type, ['regDiff'])))
        recordSaid('regDiff')
        - curDif = 'regDiff'
        if (Math.abs(cha(s, place, i))<1)
            | , while the proportion #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))] 
        else
            if (Math.abs(cha(s, place, i)) < Math.abs(cha(s, rgn, i)))
                | , but at a slower rate than
            else
                | at a faster rate than
        | across #[+value(parent)].
    else if (stories[i].type.includes('couDiff')&(!hasSaid('couDiff'))|(eq(stories[i].type, ['couDiff'])))
        recordSaid('couDiff')
        - curDif = 'couDiff'
        if (Math.abs(cha(s, place, i))<1)
            | , while the proportion #[+value(ud(cha(s, eng, i), 'rose', 'fell'))] 
        else
            if (Math.abs(cha(s, place, i)) < Math.abs(cha(s, eng, i)))
                | , but at a slower rate than
            else
                | at a faster rate than
        | across #[+value(country)].
    p 
        | In #[+value(place.name)], the proportion of #[+value(topic(i).adj_noun_s)] 
        if (Math.abs(cha(s, place, i))<0.5)
            | stayed close to #[+pc((data[s[i][0]][s[i][1]][2011][s[i][3]]))] between the last two censuses.
        else
            | #[+value(ud(cha(s, place, i), 'increased', 'decreased'))] 
            | from 
            | #[+pc((data[s[i][0]][s[i][1]][2001][s[i][3]]))]
            | in 2011 to 
            | #[+pc((data[s[i][0]][s[i][1]][2011][s[i][3]]))]
            | in 2021. 
        | During the same period, the 
        if (curDif == 'nearDiff')
            | proportion in #[+nearbyname]
            | #[+value(ud(cha(s, near, i), 'increased', 'decreased'))]  from 
            | #[+pc((near.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
            | #[+pc((near.data[s[i][0]][s[i][1]][2011][s[i][3]]))] 
        else if (curDif == 'simiDiff')
            | proportion in #[+similarname]
            | #[+value(ud(cha(s, place.similar, i), 'increased', 'decreased'))]  from 
            | #[+pc((place.similar.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
            | #[+pc((place.similar.data[s[i][0]][s[i][1]][2011][s[i][3]]))] 
        else if (curDif == 'regDiff')
            | regional proportion
            | #[+value(ud(cha(s, rgn, i), 'increased', 'decreased'))]  from 
            | #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
            | #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))] 
        else if (curDif == 'couDiff')
            | proportion across #[+value(country)]
            | #[+value(ud(cha(s, eng, i), 'increased', 'decreased'))]  from 
            | #[+pc((eng.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
            | #[+pc((eng.data[s[i][0]][s[i][1]][2011][s[i][3]]))] 
        | .
    | #[+sent2Diff(i, chain0_01, chain0_11, chain1_01, chain1_11)]

mixin similarname
    | #[+value(place.similar.name)]
    if (!hasSaid('SIMILAR'))
        recordSaid('SIMILAR')
        | , a statistically similar local authority area
        | #[+county(place.similar.name)]

mixin nearbyname
    if (!hasSaid('NEARBY'))
        recordSaid('NEARBY')
        | nearby
    | #[+value(near.name)]

mixin buck(i, curBuck, chain0_01, chain0_11, chain1_01, chain1_11)
    | The percentage of #[+value(topic(i).adj_noun)] 
    | is #[+value(ud(cha(s, place, i), 'rising', 'falling'))] 
    synz {mode:'sequence'}
        syn
            | in #[+value(place.name)]
        syn
            | here
        syn
            | in this #[+value((place.classification!='unk')?place.classification:'area')]
        syn
            | in this area
    | #[+value(ud(cha(s, place, i), ', while falling', ', while rising'))]
    if (stories[i].type.includes('regBuck')&stories[i].type.includes('couBuck'))
        | across #[+value(parent)] and #[+value(country)]
    else if (curBuck=='regBuck')
        | across #[+value(parent)]
    else if (curBuck=='couBuck')
        | across #[+value(country)]
    else if (curBuck=="simiBuck")
        | in #[+similarname]
    else if (curBuck=="nearBuck")
        | in #[+nearbyname]
    | .
    p 
        | In #[+value(place.name)], the proportion 
        | #[+value(ud(cha(s, place, i), 'went up', 'came down'))]
        | from 
        | #[+pc((data[s[i][0]][s[i][1]][2001][s[i][3]]))]
        | in 2011 to 
        | #[+pc((data[s[i][0]][s[i][1]][2011][s[i][3]]))]
        | in 2021
        if (curBuck=='couBuck')
            | , while across #[+value(country)] it
            | #[+value(ud(cha(s, place, i), 'fell', 'went up'))]
            | from #[+pc((eng.data[s[i][0]][s[i][1]][2001][s[i][3]]))]
            | to #[+pc((eng.data[s[i][0]][s[i][1]][2011][s[i][3]]))]
        else if (curBuck=="simiBuck")
            | , while across #[+value(country)] it
            | #[+value(ud(cha(s, place, i), 'fell', 'went up'))]
            | from #[+pc((place.similar.data[s[i][0]][s[i][1]][2001][s[i][3]]))]
            | to #[+pc((place.similar.data[s[i][0]][s[i][1]][2011][s[i][3]]))]
        else if (curBuck=="nearBuck")
            | , while across #[+value(country)] it
            | #[+value(ud(cha(s, place, i), 'fell', 'went up'))]
            | from #[+pc((near.data[s[i][0]][s[i][1]][2001][s[i][3]]))]
            | to #[+pc((near.data[s[i][0]][s[i][1]][2011][s[i][3]]))]
        | .
        | During the same period, the regional proportion #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))] from 
        | #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] to 
        | #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))].
    | #[+sent2Diff(i, chain0_01, chain0_11, chain1_01, chain1_11)]

mixin allOthers(i, r, updo)
    | Every local authority area across #[+value(parent)] saw a #[+value((updo=="d")?"fall":"rise")]
    | in the proportion of #[+value(topic(i).adj_noun)], as the regional average
    | #[+value((updo=="d")?"dropped":"grew")] from #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))]
    | to #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))].

mixin welsh(i)
    p
        | The proportion of Welsh speakers in !{place.name} 
        | #[+value(ud(cha(s, place, i), 'rose', 'fell'))] 
        | from #[+pc((place.data[s[i][0]][s[i][1]][2001][s[i][3]]))]
        | to #[+pc((place.data[s[i][0]][s[i][1]][2011][s[i][3]]))]
        | in the 10 years leading up to the last census. 
    if (Math.abs(place.data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])<4)
        p 
            | This amounts to the 
            | #[+value(drop(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]], 'largest decline', 'largest increase'))]
            | in the porportion of Welsh speakers of any local authority area in the country.
            if (data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1].name!=place.name)
                | Of the few areas where knowledge of the Welsh language increased, !{data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1].name} saw the greatest change
                | (from 
                | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1][2001]))]
                | to 
                | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1][2011]))]).
            else 
                | The next greatest increase was seen in !{data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[2].name} 
                | (from #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[2][2001]))] in 2011 to 
                | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[2][2011]))] in 2021), 
                | while !{data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"].name} saw the greatest decline
                | (from #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"][2001]))] to 
                | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"][2011]))]).
    p 
        - let v11speak = place.data[s[i][0]]['value'][2011][s[i][3]]
        - let v01speak = place.data[s[i][0]]['value'][2001][s[i][3]]
        - let v11nosp = place.data[s[i][0]]['value'][2011]['NoWelsh']
        - let v01nosp = place.data[s[i][0]]['value'][2001]['NoWelsh']
        - let difnosp = v11nosp - v01nosp
        - let difspeak = v11speak - v01speak
        | There are 
        | #[+value(Math.abs(difspeak))]  
        | #[+value((difspeak)<0?'fewer':'more')] people living 
        if (Math.abs(place.data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])>3)
            | here 
        else
            | in !{place.name} 
        | who speak Welsh compared with 2011, 
        | while the number of people who do not speak Welsh #[+value((difnosp)>0?'increased':'decreased')] by #[+value(Math.abs(difnosp))].
    p
        if (Math.round(place.nearbyArea.nearTops.data[s[i][0]][s[i][1]][2011][s[i][3]]*10) == Math.round(place.nearbyArea.nearTops.data[s[i][0]][s[i][1]][2001][s[i][3]]*10))
            | In #[+nearbyname], the proportion of people over the age of three
            | who can speak some Welsh remained close to #[+pc((place.nearbyArea.nearTops.data[s[i][0]][s[i][1]][2011][s[i][3]]))].
        else
            | In #[+nearbyname], #[+pc((place.nearbyArea.nearTops.data[s[i][0]][s[i][1]][2011][s[i][3]]))] of people over the age of three
            | can speak some Welsh
            | , #[+value(ud(cha(s, place.nearbyArea.nearTops, i), 'up', 'down'))]
            | from #[+pc((place.nearbyArea.nearTops.data[s[i][0]][s[i][1]][2001][s[i][3]]))] at the 2011 census.
            | .
        | Across Wales, the proportion 
        | #[+value(ud(cha(s, rgn, i), 'rose', 'fell'))] from
        | #[+pc((rgn.data[s[i][0]][s[i][1]][2001][s[i][3]]))] 
        | to
        | #[+pc((rgn.data[s[i][0]][s[i][1]][2011][s[i][3]]))] 
        | .
    if (Math.abs(place.data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]])>3) & (Math.abs(place.data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])>3)
        p
            | !{data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1].name} 
            | was one of the few areas that saw an increase in the proportion of Welsh speakers (from 
            | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1][2001]))] 
            | in 2011 to 
            | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh[1][2011]))] 
            | in 2021)
            | , while !{data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"].name} saw the greatest fall (from 
            | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"][2001]))] 
            | to 
            | #[+pc((data.welsh.perc_rank_local.top_bottom.SpeaksWelsh["-1"][2011]))]
            | ). 

//- Deals with all percentage based variables
mixin percPara(i, chain0_01, chain0_11, chain1_01, chain1_11)
    if ((findOne(stories[i].type, ['couBuck', 'regBuck']))&(!stories[i].type.includes('natRank')))
        h2 #[+value(topic(i).subhead.buc)]
    else if ((cha(s, place, i)<-1)&(data[s[i][0]]['value'][2011][s[i][3]]<data[s[i][0]]['value'][2001][s[i][3]]))
        h2 #[+value(topic(i).subhead.neg)]
    else if ((cha(s, place, i)>1)&(data[s[i][0]]['value'][2011][s[i][3]]>data[s[i][0]]['value'][2001][s[i][3]]))
        h2 #[+value(topic(i).subhead.pos)]
    else if (findOne(stories[i].type, ['nearDiff', 'couDiff', 'regDiff']))
        h2 #[+value(topic(i).subhead.sta)]
    else 
        h2 #[+value(topic(i).subhead.neu)]
    if (s[i][0] == 'welsh')
        | #[+welsh(i)]
    else
        - var chain0_11 = data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]]
        - var chain0_01 = data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]] 
        - var chain1_11 = data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]] 
        - var chain1_01 = data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]] 
        if (stories[i].type.includes('natRank'))
            | #[+rank1nat(i)]
            if (data[s[i][0]][s[i][1]+"_rank"].top_bottom[s[i][3]][1].change<0)
                p #[+allOthers(i, "", "d")]
            else if (data[s[i][0]][s[i][1]+"_rank"].top_bottom[s[i][3]]["-1"].change>0)
                p #[+allOthers(i, "", "u")]
            else if ((data[s[i][0]][s[i][1]+'_rank']['overtake'][s[i][3]].length>0)&(Math.abs(cur(s, place, i, 'r'))<10))
                p #[+overtake(i, "")]
            else
                if (Math.sign(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]]) != Math.sign(cha(s, place, i)))
                    p #[+acrossRegionExcept(i)]
                else
                    if ((sign(cha(s, place, i)))!=(sign(cur(s, place, i, 'rl'))))
                        p #[+despiteRegion(i)]
            p #[+rank2(i)]
        else if ((stories[i].type.includes('regBuck'))|(eq(stories[i].type, ['regBuck'])))
            - var curBuck = 'regBuck'
            | #[+buck(i, curBuck, chain0_01, chain0_11, chain1_01, chain1_11)]
        else if ((stories[i].type.includes('couBuck'))|(eq(stories[i].type, ['couBuck'])))
            - var curBuck = 'couBuck'
            | #[+buck(i, curBuck, chain0_01, chain0_11, chain1_01, chain1_11)]
        else if ((stories[i].type.includes('size'))&(!hasSaid('SIZE'))|(eq(stories[i].type, ['size'])))
            recordSaid('SIZE')
            | #[+sent1Perc(i)]
            p #[+sent2Perc(i, chain0_01, chain0_11, chain1_01, chain1_11)]
            p #[+sent3Perc(i)]
        else if (stories[i].type.includes('locRank'))
            deleteSaid('SIZE')
            | #[+rank1reg(i)]
            if (data[s[i][0]][s[i][1]+"_rank_local"].top_bottom[s[i][3]][1].change<0)
                p #[+allOthers(i, "_local", "d")]
            if (data[s[i][0]][s[i][1]+"_rank_local"].top_bottom[s[i][3]]["-1"].change>0)
                p #[+allOthers(i, "_local", "u")]
            else if ((data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]].length>0)&(Math.abs(cur(s, place, i, 'rl'))<20))
                p #[+overtake(i, "_local")]
            else
                if (Math.sign(data[s[i][0]][s[i][1]+'_rank_local'][s[i][2]][s[i][3]]) != Math.sign(cha(s, place, i)))
                    p #[+acrossRegionExcept(i)]
                else
                    if ((sign(cha(s, place, i)))!=(sign(cur(s, place, i, 'rl'))))
                        p #[+despiteRegion(i)]
            p #[+rank2(i)]
        else if ((stories[i].type.includes('simiBuck'))&(!hasSaid('BUCK'))|(eq(stories[i].type, ['simiBuck'])))
            recordSaid('BUCK')
            - var curBuck = 'simiBuck'
            | #[+buck(i, curBuck, chain0_01, chain0_11, chain1_01, chain1_11)]
        else if ((stories[i].type.includes('nearBuck'))&(!hasSaid('BUCK'))|(eq(stories[i].type, ['nearBuck'])))
            recordSaid('BUCK')
            - var curBuck = 'nearBuck'
            | #[+buck(i, curBuck, chain0_01, chain0_11, chain1_01, chain1_11)]
        else
            deleteSaid('SIZE')
            | #[+difference(i, chain0_01, chain0_11, chain1_01, chain1_11)]
        if (s[i][0]=='health')
            p #[+healthExplain]

mixin para(i)
    -console.log('S -', i,  stories[i])
    if (s[i][1] == 'value')
        if (s[i][0] == 'agemed')
            h2 #[+subheadAge(i)]
            | #[+sent1Age(i)]
            p #[+sent2Age(i)]
            p #[+sent3Age(i)]
        else
            h2 #[+subheadVal(i)]
            p #[+sent1pop(i)]
            p #[+sent2pop(i)]
            if (s[i][0]=='population')
                p #[+density]
            //- if ((data['density'][s[i][1]+'_rank'].overtake[s[i][3]].length>0)&(Math.abs(cur(s, place, i, "r"))<30))
            //-     p #[+sent4Pop(i)]
    if (s[i][1] == 'perc')
        | #[+percPara(i)]

mixin chartTitleSize(i)
    if (s[i][0]=="population")
        h4 
            | Population density is increasing here at a 
            | #[+value(uds(data.density.value.change.all-rgn.data.density.value.change.all, "faster rate than", "slower rate than", "similar rate to"))]
            | #[+value(parent)]
        h5 
            | Population density (usual residents per 7,140 square metres) across #[+value(place.name)], #[+value((country=="Wales")?simi.name:parent)] and #[+value(country)], March 2011, March 2021
    else if (s[i][0]=="agemed")
        h4 
            - let agegroup = data.age10yr.absChange['pos'][0][0]
            | About #[+pc(Math.round(place.data.age10yr.perc[2011][agegroup]))]
            | of people in !{place.name} are aged
            | #[+value(ageBandLU[agegroup][1])]
        h5 
            | The percentage of #[+value(topics[s[i][0]].measure)] in #[+value(place.name)] by 10 year age band, March 2011, March 2021
    else
        h4 
            | #[+value(topic(i).sample)] in 
            | #[+value(place.name)]
            | #[+value((cha(s, place, i)<0)?"decreased":"increased")] by
            | #[+rou(Math.abs(cha(s, place, i)))]
            | #[+ppoint]
        h5 
            | The percentage of #[+value(topics[s[i][0]].measure)] in #[+value(place.name)], #[+value(parent)] and #[+value(country)] that #[+value(topic(i).verb_past)], March 2011, March 2021

mixin chartTitleOther(i)
    if (s[i][0]=="population")
        h4 
            | Population density is
            | #[+value(uds(data.density.value[2011].all-rgn.data.density.value[2011].all, "higher than", "lower than", "similar to"))]
            | the average across #[+value(parent)]
        h5 
            | Population density (usual residents per #[+value(7140)] square metres) across #[+value(parent)], March 2021 (larger dots represent greater increase since 2011)
    else if (s[i][0]=="agemed")
        h4 
            - let agegroup = data.age10yr.absChange['pos'][0][0]
            | About #[+pc(Math.round(place.data.age10yr.perc[2011][agegroup]))]
            | of people in !{place.name} are aged
            | #[+value(ageBandLU[agegroup][1])]
        h5 
            | The percentage of #[+value(topics[s[i][0]].measure)] in #[+value(place.name)] by 10 year age band, March 2011, March 2021
    else
        h4 
            | #[+value(topic(i).sample)] 
            | #[+value((cur(s, place, i)-cur(s, rgn, i)<0)?"is lower than":"is higher than")] across #[+value(parent)]
        h5 
            | The percentage of #[+value(topics[s[i][0]].measure)] that #[+value(topic(i).verb_past)] across local authority areas in #[+value(parent)] and the average across #[+value(cou.name)], March 2021

mixin chartTitle(i)
    if !(isTopic)
        if (stories[i].type.includes('size'))
            | #[+chartTitleSize(i)]
        else
            | #[+chartTitleOther(i)]


-console.log("eng", eng)
-console.log("rgn", rgn)
-console.log("place", place)

// Start of th article \/
| #[+para(0)]
| #[+chartTitle(0)]
div#esc123

if (s.length>2)
    | #[+para(1)]
    | #[+chartTitle(1)]
    div#esc123

if (s.length>3)
    | #[+para(2)]
    | #[+chartTitle(2)]
    div#esc123

if (s.length>4)
    | #[+para(3)]
    | #[+chartTitle(3)]
    div#esc123

if (s.length>5)
    | #[+para(4)]
    | #[+chartTitle(4)]
    div#esc123

if (s.length>6)
    | #[+para(5)]
    | #[+chartTitle(5)]

if (more==true)
    if (s.length>7)
        div#esc123
        | #[+para(6)]
        | #[+chartTitle(6)]
    if (s.length>8)
        div#esc123
        | #[+para(7)]
        | #[+chartTitle(7)]
    if (s.length>9)
        div#esc123
        | #[+para(8)]
        | #[+chartTitle(8)]
    if (s.length>10)
        div#esc123
        | #[+para(9)]
        | #[+chartTitle(9)]
    if (s.length>11)
        div#esc123
        | #[+para(10)]
        | #[+chartTitle(10)]
    if (s.length>12)
        div#esc123
        | #[+para(11)]
        | #[+chartTitle(11)]
    if (s.length>13)
        div#esc123
        | #[+para(12)]
        | #[+chartTitle(12)]
`

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
	function loadPreTopic(code) {
		findst = false;
		loadTopic(code)
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
	function iterate(obj, pname) {
			Object.keys(obj).forEach(key => {
				if (typeof obj[key] === 'object') {
					iterate(obj[key], pname)
				} else {
					obj[key] = robojournalist(obj[key], {
						health, health,
						plcname: pname,
					})
				}
			})
		}
	function results(place, rgn, topicsIn, s, story) {
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
			cou: place.parents[0].name=="Wales"?wal:eng,
			eng: eng,
			rgn: rgn,
			uncap1: uncap1,
			regionThe: regionThe,
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
			nuword: nuword,
			sign: sign,
			udord: udord,
			eq, eq,
			near: place.nearbyArea.nearTops,
			adv: adv,
			uds: uds,
			pluralize: pluralize,
			isTopic: true,
			countyLU: countyLU,
			regionLU: regionLU,
			fuzz: fuzz,
			prev: prev,
			findOne: findOne,
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

{#if findst}
	<div style="padding: 180px; padding: 20px 20px 20px 20px; font-size: x-large;">Please wait a moment after selecting a topic while we search for relevant stories...</div>	
{/if}

{#if rgnLoad}
	{#if placesload}
	<div>
		<div style="width: 640px; margin: 50px auto;">
			<Select bind:selected options={topicOptions} placeholder="Search a topic" value="value" label="label" search={true} on:select="{() => { if (selected) { loadPreTopic(selected.value) }}}"/>
		</div>
	</div>
	{:else}
	<div style="padding: 50px; padding-left: 40%; font-size: x-large">Loading...</div>	
	{/if}
{:else}
	<div style="padding: 50px; padding-left: 40%; font-size: x-large">Loading...</div>	
{/if}



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
							<p>This article was generated using some automation. Topics are automatically chosen based on how relevant they are for each area.</p>
							<div style="height:200px"></div>
						</main>
					{/if}
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