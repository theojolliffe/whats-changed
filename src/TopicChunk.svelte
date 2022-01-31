<script>
    export let placesOb
    import { uds, adv, eq, udord, sign, nuword, ageBandLU, ord, uncap1, regionThe, drop, ud, otherRank, otherEst, qui, cha, cur, figs, get_word, city, chains, prev, getData} from "./utils";
    import { load } from "archieml"; //this is the parser from ArchieML to JSON
    import robojournalist from 'robojournalist';
	import pluralize from 'pluralize';
	import Fuse from 'fuse.js'
    const findOne = (haystack, arr) => {
		return arr.some(v => haystack.includes(v));
	};
    var expand, health, eng, wal, locRankCha, locRankCur, natRankCha, natRankCur;


    export let puggy;
    export let topics

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


	let grewSyn = {
		1: "expanded",
		2: "grew",
		3: "grew",
		4: "remained relatively stable",
		5: "fell"
	};


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

    var loaded1 = false

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

        console.log('topicsIn', topicsIn)

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

    var loadComp = false

    let resultsArray = []
    // $: placesOb.forEach(item => {
    //     resultsArray.push(results(item['place'], item['region'], topics, item['s'], item['story']))
    //     resultsArray = resultsArray
    // })
    
    $: for (let i = 0; i < placesOb.length; i++) {
            resultsArray.push(results(placesOb[i]['place'], placesOb[i]['region'], topics, placesOb[i]['s'], placesOb[i]['story']))
            if (i == placesOb.length-1 ) {
                loadComp = true
            }
    }
</script>

<!-- {#if !loadComp} -->
<div>
    <p>
        LOADING ZONE...
    </p>
</div>
<!-- {/if} -->

{#if (resultsArray.length==placesOb.length)}

    <div>
        {#each resultsArray as res}
            {@html res}
        {/each}
    </div>

{/if}