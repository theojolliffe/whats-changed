import { csvParse, autoType } from 'd3-dsv';

async function getData(url) {
  let response = await fetch(url);
  let string = await response.text();
	let data = await csvParse(string, autoType);
  return data;
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

function suffixer(int) {
  let mod = Math.round(int) % 10;
  return mod == 1 ? 'st' : mod == 2 ? 'nd' : mod == 3 ? 'rd' : 'th';
}
function drop(x, d, r) {
  let int = Math.abs(x)
  let mod = Math.round(int) % 10;
  let suff = mod == 1 ? 'st' : mod == 2 ? 'nd' : mod == 3 ? 'rd' : 'th';
  let pos = x < 0 ? d: r
  let nuLu = {1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth'}
  let word = nuLu[int]
  return word + pos
}

export { uncap1, getData, regionThe, drop };