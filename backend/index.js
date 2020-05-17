'use strict';
var { google } = require('googleapis');
require("dotenv").config();
const express = require('express');
const router = express.Router();

const playlistName = 'SUPER SMASH BROS. ULTIMATE';
const user = 'alpharadd';

// getUserPlaylist(user, playlistName);
getPlaylist('UCv6gPmMs8k2wgW9r3DUlSxg', 'Nostalgia');

function getUserPlaylist(username, playlist) {
    var service = google.youtube('v3');
    service.channels.list({
        auth: process.env.KEY,
        part: 'snippet,contentDetails,statistics',
        forUsername: username
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found???');
        }
        else {
            console.log('This channel\'s ID is %s. Its title is \'%s\'',
                channels[0].id,
                channels[0].snippet.title);

            getPlaylist(channels[0].id, playlist);
        }
    });
}

function getPlaylist(channelId, playlist) {
    var service = google.youtube('v3');
    service.playlists.list({
        auth: process.env.KEY,
        part: 'snippet,contentDetails',
        channelId: channelId,
        maxResults: 50 // max is 50
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found?');
        }
        else {
            var lst = channels;
            for (var i = 0; i < lst.length; i++) {
                if (lst[i].snippet.title == playlist) {

                    getPlaylistItems(lst[i].id, "", function (samePlaylist, token1, err) {
                        if (!err && token1 != undefined) {
                            getPlaylistItems(samePlaylist, token1, function (samePlaylist, token2, err) {
                                if (!err && token2 != undefined) {
                                }
                            })
                        }
                    });

                }
            }
        }
    });
}


function getPlaylistItems(playlist, token, callback) {
    var service = google.youtube('v3');

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
                console.log(playlistData[i].snippet.position + ": " + playlistData[i].snippet.title);
            }
            callback(playlist, response.data.nextPageToken, false);
        }

        // console.log(response.data.nextPageToken);

    });
}

