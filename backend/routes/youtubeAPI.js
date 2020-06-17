'use strict';

var express = require('express');
var router = express.Router();
var app = express();
var { google } = require('googleapis');
var bodyParser = require('body-parser');
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));

function getUserPlaylist(username, playlist) {
    var service = google.youtube('v3');
    service.channels.list({
        auth: process.env.KEY,
        part: 'snippet,contentDetails,statistics',
        forUsername: username
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return "error";
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found');
            return 'No channel found';
        }
        else {
            console.log('This channel\'s ID is %s. Its title is \'%s\'', channels[0].id, channels[0].snippet.title);

            return getPlaylist(channels[0].id, playlist, "");
        }
    });
}

function getPlaylist(channelId, playlist, token, callback) {
    var service = google.youtube('v3');
    service.playlists.list({
        auth: process.env.KEY,
        part: 'snippet,contentDetails',
        channelId: channelId,
        maxResults: 50 // max is 50
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return "error";
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found');
            return 'No channel found';
        }
        else {
            var lst = channels;
            for (var i = 0; i < lst.length; i++) {
                if (lst[i].snippet.title == playlist) {

                    getPlaylistItems(lst[i].id, token, function (playlist, nextToken, err) {
                        callback(playlist, nextToken);
                    });
                }
            }
        }
    });
}

function getPlaylistItems(playlist, token, callback) {
    var service = google.youtube('v3');
    var returnPlaylist = "Playlist: ";

    service.playlistItems.list({
        auth: process.env.KEY,
        part: 'snippet,contentDetails',
        playlistId: playlist,
        pageToken: token,
        maxResults: 50 // max is 50
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            callback(playlist, undefined, true);
        }
        var playlistData = response.data.items;

        if (playlistData.length == 0) {
            console.log('No playlist found.');
        }
        else {
            for (var i = 0; i < playlistData.length; i++) {
                // console.log(playlistData[i].snippet.position + ": " + playlistData[i].snippet.title);
                returnPlaylist += playlistData[i].snippet.position + ": " + playlistData[i].snippet.title;
            }
            callback(returnPlaylist, response.data.nextPageToken, false);
        }
    });
}

// const playlistName = 'SUPER SMASH BROS. ULTIMATE';
// const user = 'alpharadd';
// getUserPlaylist(user, playlistName);

// getPlaylist('UCv6gPmMs8k2wgW9r3DUlSxg', 'General Meme');


app.post('handle',(req, res) => {
    console.log(req.body);
});


// router.post('/', function (req, res, next) {
//     console.log(res);

//     // getPlaylist('UCv6gPmMs8k2wgW9r3DUlSxg', 'General Meme', "", function (playlist, token) {
//     //     res.setHeader('Content-Type', 'application/json');
//     //     res.json( JSON.stringify({ 
//     //         playlist: playlist,
//     //         token: token
//     //     }) );
//     // });
// });


module.exports = router;