/*==============================================================================
 * (C) Copyright 2019 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: Client-side JS functions and logic for playing music
 *----------------------------------------------------------------------------
 * Modification History
 * 2019-03-31 JJK   Initial version
 *============================================================================*/
var music = (function () {
    'use strict'; // Force declaration of variables before use (among other things)
    //=================================================================================================================
    // Private variables for the Module

    var access_token = util.urlParam('access_token');
    var refresh_token = util.urlParam('refresh_token');
    //console.log("in Music, access_token = " + access_token);
    //console.log("in Music, refresh_token = " + refresh_token);

    //=================================================================================================================
    // Variables cached from the DOM
    var $document = $(document);
    var $SpotifyLogin = $document.find("#SpotifyLogin");
    var $SpotifyIcon = $document.find("#SpotifyIcon");


    //=================================================================================================================
    // Bind events
    //$SpeechToTextButton.click(_ToggleSpeechToText);

    if (access_token == null && access_token == undefined) {

    } else {
        $SpotifyIcon.attr("src", "img/Spotify_Icon_RGB_Green.png");
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = access_token;
        const player = new Spotify.Player({
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
        });

        // Not Ready
        player.addListener('not_ready', ({
            device_id
        }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();

        // Play a specified track on the Web Playback SDK's device ID
        /*
        function play(device_id) {
            $.ajax({
                url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
                type: "PUT",
                data: '{"uris": ["spotify:track:5ya2gsaIhTkAuWYEMB0nw5"]}',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
                },
                success: function (data) {
                    console.log(data)
                }
        });
        */
// GET https: //api.spotify.com/v1/me/playlists

        player.getVolume().then(volume => {
            let volume_percentage = volume * 100;
            console.log(`The volume of the player is ${volume_percentage}%`);
        });

        //player.togglePlay();
        // load a list

    };

    function testPlay() {
        console.log("in testPlay");

                            $.ajax({
                                url: 'https://api.spotify.com/v1/me/player',
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                success: function (response) {
                                    console.log("playlists = "+JSON.stringify(response));
                                    /*
                                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                                    $('#login').hide();
                                    $('#loggedin').show();
                                    */
                                }
                            });
    }

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
        testPlay: testPlay
    };

})(); // var music = (function(){
