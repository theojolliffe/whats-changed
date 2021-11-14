export default`
// mixin standfirst1
//     | #[+value(place.name)]'s 
//     | #[+value(topic[s[0][0]+"_"+s[0][3]].subject)]
//     | #[+value(grewSyn[Math.ceil((5*locRank[0])/336)])]
//     | in the 10 years following the 2011 Census.

// mixin standfirst2
//     | Here are some of Amber Valley’s most notable changes.

// Population passes half a million
mixin subheadVal(i)
    | #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
    if (get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[0]<1)
        | nears 
    else
        | passes
    | #[+value(get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[1])]


mixin tenYears
  synz {mode:'sequence'}
    syn
      | Between the last two censuses
    syn
      | In the decade to 2021
    syn
      | In the 10 years leading up to 2021
    syn
      | In the decade leading up to the last census
    syn
      | In the 10 years leading up to the last census


// In the decade to 2021, the population of Manchester rose by over 28% from 391,221 to 503,127, giving it the greatest headcount of any local authority area in the North West of England.
mixin sent1Val(i)
    | #[+tenYears], 
    | the #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
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
    | #[+value(topic[s[i][0]+"_"+s[i][3]].synonym)] 
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
    | #[+value(Object.keys(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]][1]))] 
    | in London 
    | , with an increase of almost 
    | #[+value((figs(Object.values(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]][1]))[1])/100, {'FORMAT': '0[.]0%'})]
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
    | More private renters

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
    else
        | #[+tenYears], 
    | #[+percOfRes(place)]
    | #[+value(topic[s[i][0]+"_"+s[i][3]].clausal_modifier)] 
    if (cha(i)<0)
        | decreased
    else
        | increased 
    | from 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
    | to 
    | #[+value(figs(cur(i))[0])]
    | #[+value((figs(cur(i))[1])/100, {'FORMAT': '0[.]0%'})]
    | .

// About one in eight (13%) described their health as fair, compared with just over 23% in 2011. The percentage reporting bad health decreased from just under 13% to just over 7%.
mixin sent2Perc(i)
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[0])]
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[1])]
    | (#[+value((figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})])  
    | #[+value(topic[s[i][0]+"_"+chains[s[i][3]][0]].verb_past)]
    | in 2021, 
    | compared with 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})]
    | in 2011. 
    | The percentage 
    | #[+value(topic[s[i][0]+"_"+chains[s[i][3]][1]].clausal_modifier)] 
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
    | #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)] 
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
                | #[+value(topic[s[i][0]+"_"+otherEst(i, cha(i, "rl"), 'change')].adj_noun)] is
                if (data[s[i][0]][s[i][1]+'_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')]<0)
                    | falling
                else 
                    | growing 
                | faster than anywhere in the region.
                p #[+nowHasReg(i)] 
                recordSaid('OtherChange')
            else
                | .
                if (Math.abs(cur(i, "rl"))<6)
                    | As a result, #[+nowHasReg(i)]
                    p #[+nextHighest]
                else
                    | #[+considImprov(i)]

mixin nextHighest
    | The North West’s next highest proportion of private renters can be found in Blackpool (26.1%), while 18.8% in nearby Salford rent privately.

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
    | #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
    | and the lowest proportion of homeowners
    | .

// As a result, this area now has the region’s highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasReg(i)
    | this area now has the region’s 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]])!=1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]]<0)
        | lowest proportion of #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'highest', '2011')]==1)
            | and the 
            | highest proportion of 
            | #[+value(topic[s[i][0]+"_"+otherEst(i, 'highest', '2011')].adj_noun)]
    else
        | highest proportion of #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'lowest', '2011')]==-1)
            | and the 
            | lowest proportion of
            | #[+value(topic[s[i][0]+"_"+otherEst(i, 'lowest', '2011')].adj_noun)]
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

mixin healthExplain
    | These data are people’s own opinions in describing their overall health. They may be inconsistent with other measures of health, such as NHS records.

mixin para(i)
    if (s[i][1] == 'value')
        h2 #[+subheadVal(i)]
        if (i==1)
            p #[+startPara2] 
        p #[+sent1Val(i)]
        p #[+sent2Val(i)]
        if (s[i][0]=='population')
            p #[+density]
        p #[+sent4Val(i)]

    if (s[i][1] == 'perc')
        if (s[i][0] == 'ethnicity')
            h2 #[+subheadIncreasing(i)]
        else if (s[i][0] == 'tenure')
            h2 #[+subheadMore(i)]
        else
            h2 #[+subheadPerc(i)]
        p #[+sent1Perc(i)]
        p #[+sent2Perc(i)]
        p #[+sent3Perc(i)]
        if (s[i][0]=='health')
            p #[+healthExplain]


// p
//     | #[+standfirst1]
// p
//     | #[+standfirst2]
p Standfirst placeholder
| #[+para(0)]
| #[+para(1)]
| #[+para(2)]
| #[+para(3)]
`