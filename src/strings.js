export default`
mixin standfirst1
    | #[+value(place.name)]'s 
    | #[+value(topic[s[0][0]+"_"+s[0][3]].subject)]
    | #[+value(grewSyn[Math.ceil((5*locRank[0])/336)])]
    | in the 10 years following the 2011 Census.

mixin standfirst2
    | This coincided with a remarkable transformation of the 
    | city’s 
    | #[+value(topic[s[1][0]+"_"+s[1][3]].subject)], 
    | #[+value(topic[s[2][0]+"_"+s[2][3]].subject)]
    | and 
    // | #[+value(topic[s[3][0]+"_"+s[3][3]].subject)]
    | .

mixin subhead(i)
    | #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
    if (get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]])[0]<1)
        | nears 
    else
        | passes
    | #[+value(get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]])[1])]

// In the ten years following 2011, the population of Manchester rose 28.1% from 391,221 to 503,127, giving it the greatest headcount in the North West.
mixin sent1(i)
    | In the ten years following 2011, 
    | the #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
    | of #[+value(place.name)] 
    | rose 
    | #[+value(place.Priorities[i].value/100, {'FORMAT': '0.0%'})] 
    | from #[+value(place.data[s[i][0]][s[i][1]][2001][s[i][3]])]
    | to #[+value(place.data[s[i][0]][s[i][1]][2011][s[i][3]])], 
    | giving it the 
    if (data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]]>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | greatest 
    | #[+value(topic[s[i][0]+"_"+s[i][3]].synonym)] 
    | in the #[+value(parent)].

// The addition of over one hundred thousand people means Manchester's population is also the fastest-growing in the North West and the second-fastest-growing across England and Wales. Only Tower Hamlets in London (+29. 6%) has a faster-growing population.
mixin sent2
    | The addition of 
    | over 
    | #[+value(get_word(place.data.population.value[2011].all-place.data.population.value[2001].all))] 
    | people means 
    | Manchester's population 
    | is also the
    | fastest-growing 
    | in the North West 
    | and the second-fastest-growing across England and Wales. 
    | Only Tower Hamlets in 
    | London 
    | (+29.6%) has a 
    | faster-growing population.

mixin sent3
    | For each football pitch sized piece of land, Manchester is now home to, on average, about 44 people, compared to 34 in 2011.

mixin sent4
    | Between 2011 and 2021, Manchester overtook Wiltshire and Liverpool to become England and Wales' eighth-most populated local authority.

mixin para(i)
    h2
        | #[+subhead(i)]
    p
        | #[+sent1(i)]
    p
        | #[+sent2(i)]
    p
        | #[+sent3]
    p
        | #[+sent4]

p
    | #[+standfirst1]
p
    | #[+standfirst2]
| #[+para(0)]
`