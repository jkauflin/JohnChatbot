<?php
/*==============================================================================
* (C) Copyright 2019 John J Kauflin, All rights reserved.
*----------------------------------------------------------------------------
* DESCRIPTION: Spotify login to call the PHP versions of the API for
*              authorization
*----------------------------------------------------------------------------
* Modification History
* 2019-04-21 JJK  Initial version
*============================================================================*/

    require_once("/home/jkaufl5/external_includes/SpotifyCredentials.php");
    require 'vendor/autoload.php';

    //error_log(date('[Y-m-d H:i] ') . '$SPOTIFY_REDIRECT_URI = ' . $SPOTIFY_REDIRECT_URI . PHP_EOL, 3, 'php.log');

    $session = new SpotifyWebAPI\Session(
        $SPOTIFY_CLIENT_ID,
        $SPOTIFY_CLIENT_SECRET,
        $SPOTIFY_REDIRECT_URI
    );

    $options = [
        'scope' => [
            'streaming',
            'user-read-birthdate',
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-read-currently-playing',
            'user-modify-playback-state'
        ],
    ];

    header('Location: ' . $session->getAuthorizeUrl($options));
    die();

?>