require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');
const fs = require('fs');
const format = "YYYY/MM/DD";
var regex = /[^T]*/;

var spotify = new Spotify(keys.spotify);

var inputString = process.argv;

let command = process.argv[2];
let usersText = process.argv.slice(3).join(" ");

function getStarted(todo, args) {
    switch (todo) {
        case 'concert-this':
            bandTown(args);
            break;
        case 'spotify-this-song':
            // function
            break;
        case 'movie-this':
            //function
            break;
        case 'do-what-is-says':
            //function
            break;
    }
};

function bandTown(input) {
    axios.get(`https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`).then(
        function(response) {

            console.log(response.data[0]);
            var y = response.data[0].datetime;
            var formatDate = dateCreate(y);
            console.log(formatDate);

        });

};

function dateCreate(date) {

    var x = date.match(regex);
    var newDate = moment(x[0], format);
    var nn = newDate.format("MM/DD/YYYY");

    return nn;

};

getStarted(command, usersText);








// fs.appendFile('random.txt', 'data to append', (err) => {
//     if (err) throw err;
//     console.log('The "data to append" was appended to file!');
//   });