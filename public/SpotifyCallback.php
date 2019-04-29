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

    $session = new SpotifyWebAPI\Session(
        $SPOTIFY_CLIENT_ID,
        $SPOTIFY_CLIENT_SECRET,
        $SPOTIFY_REDIRECT_URI
    );

    // Request a access token using the code from Spotify
    $session->requestAccessToken($_GET['code']);

    $accessToken = $session->getAccessToken();
    $refreshToken = $session->getRefreshToken();

    // Send the user along and fetch some data!
    header('Location: /bot?' . 'access_token=' . $accessToken);
    die();

?>