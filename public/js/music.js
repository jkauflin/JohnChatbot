/*==============================================================================
 * (C) Copyright 2019 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: Client-side JS functions and logic for playing music
 *----------------------------------------------------------------------------
 * Modification History
 * 2019-03-31 JJK   Initial version
 * 2019-04-15 JJK   Modified to use api wrapper from
 *                  https://github.com/JMPerez/spotify-web-api-js
 *                  https://doxdox.org/jmperez/spotify-web-api-js
 *============================================================================*/
var music = (function () {
    'use strict'; // Force declaration of variables before use (among other things)
    //=================================================================================================================
    // Private variables for the Module

    var access_token = util.urlParam('access_token');
    var refresh_token = util.urlParam('refresh_token');
    //console.log("in Music, access_token = " + access_token);
    //console.log("in Music, refresh_token = " + refresh_token);
    var spotifyApi = new SpotifyWebApi();
    var player;
    var deviceId;
    
    //=================================================================================================================
    // Variables cached from the DOM
    var $document = $(document);
    var $SpotifyIcon = $document.find("#SpotifyIcon");

    //=================================================================================================================
    // Bind events

    if (access_token == null && access_token == undefined) {
    } else {
        spotifyApi.setAccessToken(access_token);
        $SpotifyIcon.attr("src", "img/Spotify_Icon_RGB_Green.png");

        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = access_token;
            player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => {
                    cb(token);
                }
            });

            // Error handling
            player.addListener('initialization_error', ({
                message
            }) => {
                console.error(message);
            });
            player.addListener('authentication_error', ({
                message
            }) => {
                console.error(message);
            });
            player.addListener('account_error', ({
                message
            }) => {
                console.error(message);
            });
            player.addListener('playback_error', ({
                message
            }) => {
                console.error(message);
            });

            // Playback status updates
            player.addListener('player_state_changed', state => {
                console.log(state);
            });

            // Ready
            player.addListener('ready', ({
                device_id
            }) => {
                console.log('Ready with Device ID', device_id);
                deviceId = device_id;
            });

            // Not Ready
            player.addListener('not_ready', ({
                device_id
            }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect();
        };
    }


    function testPlay() {
        console.log("in testPlay");

        player.getVolume().then(volume => {
            let volume_percentage = volume * 100;
            console.log(`The volume of the player is ${volume_percentage}%`);
        });

                spotifyApi.play(
                    {
                        "device_id":deviceId,
                        "uris": ["spotify:track:5ya2gsaIhTkAuWYEMB0nw5"]
                    }, function (err, data) {
                    if (err) console.error(err);
                    else console.log('Playing song');
                });


        /*
        // passing a callback - get Elvis' albums in range [20...29]
        spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {
            limit: 10,
            offset: 20
        }, function (err, data) {
            if (err) console.error(err);
            else console.log('Artist albums', data);
        });

            if (response.length > 0) {
                for (var current in response) {
                    //console.log("question = " + response[current].question);
                } // loop through JSON list
            }

        */

    }

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
        testPlay: testPlay
    };

})(); // var music = (function(){
