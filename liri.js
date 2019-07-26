require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');
const fs = require('fs');


const format = "YYYY/MM/DD";
const regex = /[^T]*/;
const BREAK = `----------------------------`;

var spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let usersText = process.argv.slice(3).join(" ");

function getStarted(todo, args) {

    // sends the action and a newline to the LOG text
    actionAppend(todo);

    switch (todo) {
        case 'concert-this':
            bandTown(args);
            break;
        case 'spotify-this-song':
            spotty(args);
            break;
        case 'movie-this':
            movie(args);
            break;
        case 'do-what-it-says':
            readText(args);
            break;
    }
};

function bandTown(input) {

    axios.get(`https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`).then(function(response) {

        // grabs length of the response
        // array to create a loop
        var arr = response.data;
        var arrLength = arr.length;

        for (var i = 0; i < arrLength; i++) {

            // console.log(response.data.config);
            // grabbing the date time and sending it to the formatter
            var y = response.data[i].datetime;
            var formatDate = dateCreate(y);

            // this is the meat of it. Data formatted to fit your screen.
            console.log(`\n`);
            console.log(BREAK);
            console.log(`${arr[i].venue.name}\nThis show is in ${arr[i].venue.city}, ${arr[i].venue.region}\nDATE: ${formatDate} `);
            console.log(BREAK);
        }
    }).catch(function(error) {

        // this ensures that if the artist is not
        // found it will display artist not found
        console.log(`\n${BREAK}`);
        console.log(error.response.data.errorMessage);
        console.log(`${BREAK}\n`);
    });
};

function spotty(input) {

    var x = input;

    // would not work with triple equals, but basically if the input
    // is blank, it will search for the sign by ace of base
    if (x == "") x = "the sign";

    spotify.search({ type: 'track', query: x }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < 20; i++) {
            console.log('\n');
            console.log(`Artist: ${data.tracks.items[i].artists[0].name}\nAlbum: ${data.tracks.items[0].name}\nSong: ${data.tracks.items[i].name}\nPreview URL: ${data.tracks.items[i].preview_url}`);
        }

    });
};

function movie(input) {

    // might be a better way, but i set the default value 
    // and change it if the user entered something for input.
    var search = "mr nobody";
    if (input) search = input;

    axios.get(`http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`).then(
        function(response) {

            console.log(`\n`);
            console.log(`Title: ${response.data.Title}\n${response.data.Year}\nRating: ${response.data.imdbRating}\nRT Rating:${JSON.stringify(response.data.Ratings[1])}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\n\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}`);
            console.log(`\n`);
        }
    );
};

function readText(input) {

    var filename = "random.txt";
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ' + filename);

        // little confusing, but the data returned was one long string. So I split the string on the spaces
        // then I sliced off the first element and joined the rest with spaces, and passed it back to the started
        // method.
        var x = data.split(" ");
        var z = x.slice(1).join(" ");

        //calling the "main" function with our new "command" and "usersText"
        getStarted(x[0], z);

    });
};


//matches the date provided without the extra stuff and changes it
function dateCreate(date) {

    var x = date.match(regex);
    var newDate = moment(x[0], format);
    var nn = newDate.format("MM/DD/YYYY");

    return nn;
};

function fileAppender(data) {

    var log = `log.txt`;

    fs.appendFile(log, data, (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
};

function actionAppend(action) {
    var log = `log.txt`;
    action = action + " \n\n";

    fs.appendFile(log, action, (err) => {
        if (err) throw err;

    });
}


//main
getStarted(command, usersText);