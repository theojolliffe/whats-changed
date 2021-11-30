import { csvParse, autoType } from 'd3-dsv';
import robojournalist from 'robojournalist';

async function getData(url) {
  let response = await fetch(url);
  let string = await response.text();
	let data = await csvParse(string, autoType);
  return data;
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

let array = ['South East', 'South West', 'East', 'West Midlands', 'East Midlands', 'North East', 'North West']
function regionThe(place, nt) {
  if (place=="East") { place = place + " England"}
  return ((!array.includes(place))|(nt=="NT")) ? place : 'The ' + place;
}

function uncap1(string) {
    if (string.slice(0, 3)=="The") {
        return string.charAt(0).toLowerCase() + string.slice(1);
    } else { return string }
}


function drop(x, d, r) {
  let int = Math.abs(x)
  let mod = Math.round(int) % 10;
  let suff = mod == 1 ? 'st' : mod == 2 ? 'nd' : mod == 3 ? 'rd' : 'th';
  let pos = x < 0 ? d: r
  let nuLu = {1: '', 2: 'second-', 3: 'third-', 4: 'fourth-', 5: 'fifth-'}
  let word = nuLu[int]
  return word + pos
}


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
function figs(x, f) {
  if (f!=3) {
    f = 2
  }
  let sigfig = Number.parseFloat(Number.parseFloat(x).toPrecision(f))
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
    text = "about"
  }
  return [text, sigfig];
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

function sign(x, y) {
  if (Math.sign(x) == Math.sign(y)) {
    return true
  } else {
    return false
  }
}


var ones = ['', '', 'second-', 'third-', 'fourth-', 'fifth-', 'sixth-', 'seventh-', 'eighth-', 'ninth-'];

var nuwords = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function nuword(x) {
  if (x<10) {
    return nuwords[x]
  } else {
    return x
  }
}

function suffixer(int) {
  let ord
  if (int==12) {
    ord = 'twelfth'
  } else if ((int>10)&(int<20)) {
    ord = int+"th"
  } else {
    let mod = Math.round(int) % 10;
    ord = mod == 1 ? int+'st' : mod == 2 ? int+'nd' : mod == 3 ? int+'rd' : int+'th';
  }
  return ord
}

function ord(x) {
  console.log("X", x)
  let ordin
  if (Math.abs(x)<10) {
    ordin = ones[Math.abs(x)]
  } else {
    ordin = suffixer(Math.abs(x))+"-"
  }
  return ordin
}

var ageBandLU = {
  '0-9': ['children under the age of nine years', 'under nine years'],
  '10-19': ['people between the ages of 10 and 19 years','between 10 and 19 years'],
  '20-29': ['people between the ages of 20 and 29 years', 'between 20 and 29 years'],
  '30-39': ['people between the ages of 30 and 39 years','between 30 and 39 years'],
  '40-49': ['people between the ages of 40 and 49 years','between 40 and 49 years'],
  '50-59': ['people between the ages of 50 and 59 years','between 50 and 59 years'],
  '60-69': ['people between the ages of 60 and 69 years','between 60 and 69 years'],
  '70-79': ['people between the ages of 70 and 79 years', 'between 70 and 79 years'],
  '80plus': ['people aged 80 years or over', 'over the age of 80 years']
}
function eq(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}
function udord(n, w1, w2) {
  let w = ud(n, w1, w2)
  let nu = ord(n)
  return nu+w
}

export { udord, sign, nuword, eq, ageBandLU, uncap1, getData, regionThe, drop, ud, otherRank, otherEst, qui, cha, cur, figs, get_word, city, ord, chains };