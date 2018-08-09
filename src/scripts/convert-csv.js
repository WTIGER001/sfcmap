let csvToJson = require('convert-csv-to-json');

let fileInputName = 'data.csv';
let fileOutputName = 'monsters.json';

csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);