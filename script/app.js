/* 
* Choice of API: https://api.worldbank.org/v2/countries/BE/indicators/SP.POP.TOTL?per_page=5000&format=json
* Default set to Belgium
* countries.json to add countries (manual adding)
* Last reviewed 24/11/2020
* Version: 0.1
*/

'use strict';

let JSONcountries;
let canvas;
let chart;

const generateDropdownCountries = function() {
    console.log("Generating Country Dropdown!");
    let countriesDropdown = document.querySelector(".js-countries");
    //console.log(JSONcountries);
    for(const country of Object.keys(JSONcountries)) {
        let option = document.createElement("option");
        option.text = `${country}`;
        option.value = `${country}`
        countriesDropdown.add(option);
    }

    //Add event listener to element
    countriesDropdown.addEventListener("input", function() {
        console.log("Selection Changed!");
        chart.destroy();
        getCountryPopulation(JSONcountries[document.querySelector(".js-countries").value]);
    });
}

const getAPILabels = function(json) {
    console.log("Getting Labels!");
    let result = [];
    for(const entry of json[1]) {
        if(entry["value"] != null) {
            result.push(entry["date"]);
        } 
    }
    result = result.slice(0, 15);
    //console.log(result); // DEBUG
    return result.reverse();
};

const getAPIData = function(json) {
    console.log("Getting Data!");
    let result = [];
    for(const entry of json[1]) {
        if(entry["value"] != null) {
            //result.push((entry["value"]).toLocaleString('be-BE'));
            result.push(entry["value"]);
        }
    }
    result = result.slice(0, 15);
    //console.log(result); // DEBUG
    return result.reverse();
};

const generateChart = function(json) {
    console.log("Generating Chart!");
    let data = getAPIData(json);
    let labels = getAPILabels(json);
    //console.log(json);
    chart = new Chart(canvas, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: labels,
            label: `Population Growth Of ${json[1][0]["country"]["value"]} (Yearly)`,
            borderWidth: 1,
            datasets: [{
                label: `Population Growth Of ${json[1][0]["country"]["value"]} (Yearly)`,
                backgroundColor: 'rgb(128, 128, 128)',
                borderColor: 'rgb(128, 128, 128)',
                data: data,
                fill: false
            }]
        },
    
        // Configuration options go here
        options: {
        }
    });
    //Make table of data
    generateTable(labels, data);
}

const generateTable = function(labels, data) {
    let table = document.querySelector(".js-table-data");
    let records = "";

    for(let i=0; i < labels.length; i++) {
        records += `<tr><td >${labels[i]}</td><td>${data[i].toLocaleString("be-BE")}</td></tr>`;
    }

    table.innerHTML = `<table style="width: 100%"><thead><tr><th>Year</th><th>Population</th></tr></thead><tbody>${records}</tbody></table>`;
}

const getCountryPopulation = (country) => {
	// Eerst bouwen we onze url op
	let url = `https://api.worldbank.org/v2/countries/${country}/indicators/SP.POP.TOTL?per_page=5000&format=json`;
    console.log(`Fetching Country Population URL: ${url}`);
    // Met de fetch API proberen we de data op te halen.
	fetch(url)
        .then((res) => res.json())
        .then(json => {
            //console.log(json);
            generateChart(json);
        })//.catch(err => console.error(err));
};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialized!");
    canvas = document.querySelector('.js-graph').getContext('2d');
    // Generate Country List
    fetch("./assets/countries.json").then(response => response.json()).then(json => {
        JSONcountries = json;
        generateDropdownCountries();
    });
	// Call default country
	getCountryPopulation("BE");
});