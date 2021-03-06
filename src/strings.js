export default`
mixin standfirst1
    // | #[+value(topic[s[0][0]+"_"+s[0][3]].subject)]
    // | #[+value(grewSyn[Math.ceil((5*locRank[0])/336)])]
    // | in the 10 years following the 2011 Census.
    p 
        | #[+value(place.name)]'s
        | #[+value(topic(0).subject)]
        | #[+value(grewSyn[qui(natRankCha[0])])] 
        | in the 10 years leading up to the most recent Census. 
        | This coincided with a 
        if (changeMag>30)
            | remarkable 
        else if (changeMag>20)
            | considerable
        | transformation of the 
        | #[+value(place.classification)]'s 
        eachz sfi in sf.slice(1,) with { separator: ',', last_separator: 'and' }
            | #{topics[sfi[0]].general}
        | .
    p Here are some of the most notable changes from across the 
        | #[+value(place.gss)].

// Population passes half a million
mixin subheadVal(i)
    | #[+value(topic(i).subject)] 
    if (get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[0]<1)
        | nears 
    else
        | passes
    | #[+value(get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[1])]

// A younger Manchester
mixin subheadAge(i)
    | A younger
    | #[+value(place.name)]

mixin tenYears
  synz {mode:'sequence'}
    syn
      | between the last two censuses
    syn
      | in the decade to 2021
    syn
      | in the 10 years leading up to 2021
    syn
      | in the decade leading up to the last census
    syn
      | in the 10 years leading up to the last census

// Between the last two censuses, the average age in Manchester fell by two years, from 34 to 32 years of age.
mixin sent1Age(i)
    if (i==1)
        | Census 2021 data also shows a shift in the local population's well-being.
    else
        | #[+tenYears],
    | the #[+value(topic(i).subject)] 
    | in #[+value(place.name)] 
    | fell by
    | #[+value(Math.abs(place.stories[i].value))] years,
    | from #[+value(data[s[i][0]][s[i][1]][2001][s[i][3]])]
    | to #[+value(data[s[i][0]][s[i][1]][2011][s[i][3]])] years of age.

// Manchester's average age is the lowest in the North West and remains significantly lower than the average age across England (38 years of age).
mixin sent2Age(i)
    | Manchester's average age is the lowest in the North West and remains significantly lower than the average age across England (38 years of age).

// The drop in age was largely driven by an increase of nearly 50,000 people between the ages of 20 and 29 years, while the population over the age of 70 years decreased by almost two thousand.
mixin sent3Age(i)
    | The drop in age was largely driven by an increase of nearly 50,000 people between the ages of 20 and 29 years, while the population over the age of 70 years decreased by almost two thousand.

// In the decade to 2021, the population of Manchester rose by over 28% from 391,221 to 503,127, giving it the greatest headcount of any local authority area in the North West of England.
mixin sent1Val(i)
    if (i==1)
        | Census 2021 data also shows a shift in the local population's well-being.
    else
        | #[+tenYears],    
    | the #[+value(topic(i).subject)] 
    | of #[+value(place.name)] 
    | rose 
    | #[+value(figs(place.stories[i].value)[0])]
    | #[+value((figs(place.stories[i].value)[1])/100, {'FORMAT': '0[.]0%'})] 
    | from #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[0])]
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[1])]
    | to #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]])[1])],
    | giving it the 
    if (data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]]>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | greatest 
    | #[+value(topic(i).synonym)] 
    | of any local authority area in #[+value(parent)].

// The addition of over 100,000 people means Manchester's population is also the fastest-growing in the North West and the second-fastest-growing across England. Only Tower Hamlets in London, with an increase of almost 30%, has a faster-growing population.
mixin sent2Val(i)
    | The 
    if (data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]]<0)
        | loss
    else
        | addition
    | of 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]], "num")[0])] 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]], "num")[1])]
    | people 
    | means
    | #[+value(place.name)]'s 
    | population 
    | is also the
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | fastest-growing 
    | in the #[+value(parent)] 
    | and the 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]])>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | fastest-growing 
    | across 
    | #[+value(country)]. 
    | Only 
    | #[+value(Object.keys(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]]['1.0']))]
    | in London 
    | , with an increase of almost 
    | #[+value((figs(Object.values(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]]['1.0']))[1])/100, {'FORMAT': '0[.]0%'})]
    | , has a 
    | faster-growing 
    | population.

// For each football pitch-sized piece of land (about 7,140 square metres), Manchester is now home to, on average, about 31 people, compared to 24 in 2011.
mixin density
    | For each football pitch sized piece of land (about #[+value(7140)] square metres), #[+value(place.name)] is now home to, on average, about 
    | #[+value(figs(0.714*data.density.value[2011].all)[1])] 
    | people, compared to 
    | #[+value(figs(0.714*data.density.value[2001].all)[1])] in 2011.

// Between 2011 and 2021, Manchester overtook Wiltshire and Liverpool to become England's eighth-most populated local authority.
mixin sent4Val(i)
    | Between 2011 and 2021, #[+value(place.name)] 
    | overtook 
    | #[+value(data[s[i][0]][s[i][1]+'_rank'].overtake[s[i][3]][0])] 
    | and 
    | #[+value(data[s[i][0]][s[i][1]+'_rank'].overtake[s[i][3]][1])] 
    | to become #[+value(country)]'s
    | #[+value(data.population.value_rank[2011].all, {'ORDINAL_TEXTUAL':true})]
    | most 
    | populated 
    | local authority.

// Increasing ethnic diversity
mixin subheadIncreasing(i)
    | Increasing ethnic diversity

// Health improves
mixin subheadMore(i)
    | More 
    | #[+value(topic(i).adj_noun)]

// Health improves
mixin subheadEcon(i)
    | Higher rate of 
    | #[+value(topic(i).topic)]

// Health improves
mixin subheadPerc(i)
    | Health improves

mixin percOfRes(place)
    synz {mode:'sequence'}
        syn
            | the percentage of #[+value(place.name)] residents
        syn
            | the percentage of people living in #[+value(place.name)] 

// In the 10 years leading up to the last census, the percentage of Manchester residents describing their health as good increased from just over 66% to about 80%.
mixin sent1Perc(i)
    if (i==1)
        | Census 2021 data also shows a shift in the local population's well-being.
    | #[+percOfRes(place)]
    | #[+value(topic(i).clausal_modifier)] 
    if (cha(i)<0)
        | decreased
    else
        | increased 
    | from 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
    if (i==1)
        | in 2011
    | to 
    | #[+value(figs(cur(i))[0])]
    | #[+value((figs(cur(i))[1])/100, {'FORMAT': '0[.]0%'})]
    if (i!=1)
        | #[+tenYears]
    | .

// About one in eight (13%) described their health as fair, compared with just over 23% in 2011. The percentage reporting bad health decreased from just under 13% to just over 7%.
mixin sent2Perc(i)
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[0])]
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[1])]
    | (#[+value((figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})])  
    | #[+value(topic(i, chains[s[i][3]][0]).verb_past)]
    | in 2021,
    | compared with
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})]
    | in 2011. 
    | The percentage 
    | #[+value(topic(i, chains[s[i][3]][1]).clausal_modifier)] 
    if (data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]]>data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])
        | decreased 
    else
        | increased
    | from 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]])[1])/100, {'FORMAT': '0[.]0%'})]
    | to 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])[1])/100, {'FORMAT': '0[.]0%'})]
    | .

mixin inRegion
    synz {mode:'sequence'}
        syn 
            | in any other local authority district across
        syn
            | anywhere else in

// The percentage of healthy residents is increasing faster here than in any other local authority district across England.
mixin sent3Perc(i)
    | The percentage of 
    | #[+value(topic(i).adj_noun)] 
    | is 
    if (Math.abs(cha(i, "rl"))==1)
        if (cha(i, "rl")<0)
            | decreasing
        else
            | increasing 
        | faster here than #[+inRegion]
        if (cha(i, "r")==1) 
            | #[+value(country)]
            | .
            if (Math.abs(cur(i, "r"))<11)
                | #[+nowHasCou(i)]
            else
                | #[+considImprov(i)]
        else
            | #[+value(parent)]
            if ((Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')])==1)&(!hasSaid('OtherChange')))
                | , while the percentage of 
                | #[+value(topic(i, otherEst(i, cha(i, "rl"), 'change')).adj_noun)] is
                if (data[s[i][0]][s[i][1]+'_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')]<0)
                    | falling
                else 
                    | growing 
                | faster than anywhere in 
                if (parent=="London")
                    | the city.
                else
                    | the region.
                if ((i!=hiRank.rankIn)&(s[i][0]!='health'))
                    p #[+nowHasReg(i)] 
                recordSaid('OtherChange')
            else
                | .
                if (Math.abs(cur(i, "rl"))<6)
                    | As a result, #[+nowHasReg(i)]
                    if ((i!=hiRank.rankIn)&(s[i][0]!='health'))
                        p #[+nextHighest(i)]
                else
                    | #[+considImprov(i)]

// Blackburn with Darwen has the region's next lowest proportion of residents from a White ethnic group (69.2%), while 90.1% in nearby Salford are from a White ethnic group.
mixin nextHighest(i)
    if (cur(i, "rl")<0)
        | #[+value(data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].above.name)] 
        | has the region's next lowest proportion of 
        | #[+value(topic(i).adj_noun)]
        | (#[+value((data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].above.value)/100, {'FORMAT': '0[.]0%'})]), 
    else
        | #[+value(data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].below.name)] 
        | has the region's next highest proportion of 
        | #[+value(topic(i).adj_noun)]
        | (#[+value((data[s[i][0]][s[i][1]+"_rank_local"]['above_below'][s[i][3]].below.value)/100, {'FORMAT': '0[.]0%'})]),
    | while the proportion is
    | #[+value((place.nearSimilar.nearTops.data[s[i][0]][s[i][1]][2011][s[i][3]])/100, {'FORMAT': '0[.]0%'})]
    | in nearby #[+value(place.nearSimilar.nearTops.name)].

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

// As a result, this area now has the region???s highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasReg(i)
    | this area now has 
    if (parent=="London")
        | the city
    else
        | the region???s 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]])!=1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]]<0)
        | lowest proportion of #[+value(topic(i).adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'highest', '2011')]==1)
            | and the 
            | highest proportion of 
            | #[+value(topic(i, otherEst(i, 'highest', '2011')).adj_noun)]
    else
        | highest proportion of #[+value(topic(i).adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'lowest', '2011')]==-1)
            | and the 
            | lowest proportion of
            | #[+value(topic(i, otherEst(i, 'lowest', '2011')).adj_noun)]
    | .

// The considerable improvement has brought health in Manchester close to the national average (about 81% in England described their health as good in 2021).
mixin considImprov(i)
    if (data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]]==1)
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the considerable improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than
        else
            | The considerable improvement has brought health in 
            | #[+value(place.name)] close to 
        | the national average
        | (#[+value(figs(eng.data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
        | #[+value((figs(eng.data[s[i][0]][s[i][1]][2011][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
        | in #[+value(country)] described their health as good in 2021).
    else
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the considerable improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than   
        else
            | The considerable improvement has brought health in 
            | #[+value(place.name)] close to 
        | the regional average
        | (#[+value(figs(rgn.data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
        | #[+value((figs(rgn.data[s[i][0]][s[i][1]][2011][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
        | in #[+value(parent)] described their health as good in 2021).

mixin overtake(i)
    | During this period, 
    | the 
    | #[+value(place.gss)] 
    | overtook 
    if (data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]].length<4)
        eachz item in data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]] with { separator: ',', last_separator: 'and' }
            | #{item}
    else if (overtake.length<10)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]].length)] areas, including #[+value(data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]][0])] and #[+value(data[s[i][0]][s[i][1]+'_rank_local']['overtake'][s[i][3]][1])]
    | , giving it the region's 
    if (Math.abs(locRankCur[i])>1)
        | #[+value(locRankCur[i], {'ORDINAL_TEXTUAL':true})]
    | highest proportion of 
    | #[+value(topic(i).adj_noun)]
    if (Math.abs(locRankCur[i])>1)
        | , behind only Cambridge with 8.2%
    | .

mixin healthExplain
    | These data are people???s own opinions in describing their overall health. They may be inconsistent with other measures of health, such as NHS records.

mixin para(i)
    if (s[i][1] == 'value')
        if (s[i][0] == 'agemed')
            h2 #[+subheadAge(i)]
            p #[+sent1Age(i)]
            p #[+sent2Age(i)]
            p #[+sent3Age(i)]
        else
            h2 #[+subheadVal(i)]
            p #[+sent1Val(i)]
            p #[+sent2Val(i)]
            if (s[i][0]=='population')
                p #[+density]
            p #[+sent4Val(i)]

    if (s[i][1] == 'perc')
        if (s[i][0] == 'ethnicity')
            h2 #[+subheadIncreasing(i)]
        else if (s[i][0] == 'economic')
            h2 #[+subheadEcon(i)]        
        else if (s[i][0] == 'health')
            h2 #[+subheadPerc(i)]
        else
            h2 #[+subheadMore(i)]
        p #[+sent1Perc(i)]
        if (i==hiRank.rankIn)
            p #[+overtake(i)]
            p #[+sent2Perc(i)]
            p #[+sent3Perc(i)]
        else
            p #[+sent2Perc(i)]
            p #[+sent3Perc(i)]
        if (s[i][0]=='health')
            p #[+healthExplain]

| #[+standfirst1]
| #[+para(0)]
| #[+para(1)]
| #[+para(2)]
// if (s.length>3)
//     | #[+para(3)]
// if (s.length>4)
//     | #[+para(4)]
// if (s.length>5)
//     | #[+para(5)]
// if (s.length>6)
//     | #[+para(6)]
// if (s.length>7)
//     | #[+para(7)]
// if (s.length>8)
//     | #[+para(8)]
`