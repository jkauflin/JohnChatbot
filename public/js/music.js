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
    
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = '*** token ***';
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
    };


    //=================================================================================================================
    // Variables cached from the DOM
    var $document = $(document);
    //var $SpeechToTextButton = $document.find("#SpeechToTextButton");

    //=================================================================================================================
    // Bind events
    //$SpeechToTextButton.click(_ToggleSpeechToText);



/*     function stopSpeaking() {
        if (speaking) {
            speechSynth.cancel();
        }
    }
 */

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
    };

})(); // var music = (function(){
