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
		defaultLoc = 'Somerset West and Taunton';
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