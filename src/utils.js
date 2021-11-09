import { csvParse, autoType } from 'd3-dsv';

async function getData(url) {
  let response = await fetch(url);
  let string = await response.text();
	let data = await csvParse(string, autoType);
  return data;
}

let array = ['South East', 'South West', 'East', 'West Midlands', 'East Midlands', 'North East', 'North West', 'Yorkshire and The Humber']
let regionThe = place => !array.includes(place) ? place : 'The ' + place;

function uncap1(string) {
    if (string.slice(0, 3)=="The") {
        return string.charAt(0).toLowerCase() + string.slice(1);
    } else { return string }
}

export { uncap1, getData, regionThe };