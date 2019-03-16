/*==============================================================================
 * (C) Copyright 2017,2018,2019 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: Client-side JS functions and logic for JohnBot2
 *----------------------------------------------------------------------------
 * Modification History
 * 2017-09-08 JJK Initial version 
 * 2017-12-29 JJK	Initial controls and WebSocket communication
 * 2017-01-21 JJK	Implementing response to buttons for manual controls
 * 2018-12-07 JJK	Re-factor to use modules
 * 2018-12-25 JJK	I'm always thankful on Christmas
 * 2019-01-19 JJK	Change back to search using web site database and new
 * 					fuzzy match algorithm
 * 2019-02-01 JJK	Implement command check on spoken text
 * 					Working on activity loop
 * 2019-02-08 JJK	Implementing jokes query and cache
 * 2019-02-09 JJK	Implementing robotCommand, and getUserName
 * 2019-02-10 JJK	Moved manual controls to seperate module
 * 2019-02-11 JJK	Added button to Start interaction (and ask for name)
 * 2019-02-16 JJK	Added walkAbout and Stop button
 *============================================================================*/
var identityManagement = (function () {
    'use strict'; // Force declaration of variables before use (among other things)
    //=================================================================================================================
    // Private variables for the Module
    var env;
    var ws = null;
    var wsConnected = false;
    var isTouchDevice = false;
    var date;

    var jokeQuestions = [];
    var jokeAnswers = [];
    var jokeStarted = false;
    var prevJoke = -1;
    var currJoke = 0;

    var userName = '';
    var getUserName = false;
    var lastTextToSpeak = '';
    var confirmName = false;

    //=================================================================================================================
    // Variables cached from the DOM
    var $document = $(document);
    var $logMessage = $document.find("#logMessage");
    var $StatusDisplay = $document.find("#StatusDisplay");

    var $StartButton = $document.find("#StartButton");
    var $StopButton = $document.find("#StopButton");
    var $SearchButton = $document.find("#SearchButton");
    var $SearchInput = $document.find("#SearchInput");
    var $searchStr = $document.find("#searchStr");

    //=================================================================================================================
    // Bind events
    isTouchDevice = 'ontouchstart' in document.documentElement;

    // Get environment variables
    var jqxhr = $.getJSON("dotenv.php", "", function (inEnv) {
        env = inEnv;
        //console.log("botEnv, BOT_WEB_URL = " + env.BOT_WEB_URL);
        //console.log("botEnv, UID = " + env.UID);
        _cacheJokes();
        _connectToBot(env.wsUrl);
    }).fail(function () {
        console.log("Error getting environment variables");
    });

    if (!isTouchDevice) {
        $SearchInput.change(_searchResponses);
    } else {
        $SearchButton.click(_searchResponses);
    }

    $StartButton.click(_startInteraction);
    $StopButton.click(_stop);

    //=================================================================================================================
    // Module methods
    function logMessage(message) {
        console.log(message);
        $logMessage.html(message);
    }

    // General function to send the botMessageStr to the server if Websocket is connected
    function sendCommand(botMessageStr) {
        //console.log("in sendCommand, wsConnected = "+wsConnected);
        if (wsConnected) {
            //console.log("in sendCommand, botMessageStr = "+botMessageStr);
            ws.send(botMessageStr);
        }

        // figure out when not connected anymore (and set display)
    }

    // Try to establish a websocket connection with the robot
    function _connectToBot(wsUrl) {
        //console.log("in connectToBot, wsUrl = " + wsUrl);
        ws = new WebSocket(wsUrl);
        // event emmited when connected
        ws.onopen = function () {
            wsConnected = true;
            //console.log('websocket is connected ...')
            $StatusDisplay.html("Connected");

            // event emmited when receiving message from the server (messages from the robot)
            ws.onmessage = function (messageEvent) {
                var serverMessage = JSON.parse(messageEvent.data);
                if (serverMessage.errorMessage != null) {
                    logMessage(serverMessage.errorMessage);
                }

                // add other bot event handling here
                if (serverMessage.proxIn != null) {
                    $("#proximityInches").html("Proximity inches: " + serverMessage.proxIn);
                }

            } // on message (from server)

        } // Websocket open
    }

    function _startInteraction() {
        getUserName = true;
        sayAndAnimate("Hello, I am the John bought.  What is your name?");
    }

    function _stop() {
        sendCommand('{"stop":1}');
    }

    function _searchResponses() {
        //console.log("searchStr = " + $searchStr.val());
        handleTextFromSpeech($searchStr.val());
        $searchStr.val('');
    }

    function _getRandomInt(min, max) {
        // Floor - rounded down to the nearest integer
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Respond to string recognized by speech to text (or from search input text box)
    function handleTextFromSpeech(speechText) {
        speechText = speechText.toLowerCase();
        //console.log(" in handleTextFromSpeech, speechText = " + speechText);

        // Check the speech text for commands to send to the robot
        checkRobotCommands(speechText);

        // clever
        // no i get it, that's very clever
        // how's that working out for you
        // what 
        // being clever

        // after X period of time without a command (or verbal response?)
        // require a "wake up" phrase to accept commands again
        // or if it start executing something like playing music

        // Check the speech text for other actions, or query response
        if (speechText == "what" || speechText.search("repeat that") >= 0 || speechText.search("say that again") >= 0 ||
            speechText.search("what was that") >= 0 || speechText.search("you say") >= 0) {
            sayAndAnimate(lastTextToSpeak);
        } else if (confirmName) {
            confirmName = false;
            if (speechText.search("yes") >= 0) {
                sayAndAnimate("Hello, " + userName + ".  It is nice to meet you.");
                // *** save the user name at this point ***
            } else {
                getUserName = true;
                sayAndAnimate("I'm sorry, what was your name?");
            }
        } else if (getUserName) {
            getUserName = false;
            userName = speechText;
            // strip out any - my name is, I am, they call me
            sayAndAnimate("Did you say your name was " + userName);
            confirmName = true;
        } else if (speechText.search("tell") >= 0 && speechText.search("joke") >= 0) {
            currJoke = _getRandomInt(0, jokeQuestions.length);
            if (currJoke == prevJoke) {
                currJoke = _getRandomInt(0, jokeQuestions.length);
            }
            sayAndAnimate(jokeQuestions[currJoke]);
            jokeStarted = true;
        } else if (jokeStarted) {
            sayAndAnimate(jokeAnswers[currJoke]);
            jokeStarted = false;
        } else {
            // eventually cache responses and implement the search in the client
            // using the pairs check?
            // Send the speech text to a search service to check for response
            $.getJSON(env.BOT_WEB_URL + "getBotResponsesProxy.php", "searchStr=" + util.replaceQuotes(speechText) + "&UID=" + env.UID, function (response) {
                //console.log("response.length = " + response.length);
                //console.log("response = " + JSON.stringify(response));

                // 2019-01-25 Remove the default - if you don't find a response, don't say anything
                //var textToSpeak = "I am not programmed to respond in this area.";
                if (response.length > 0) {
                    if (response[0].score > 1) {
                        sayAndAnimate(response[0].verbalResponse);
                        if (response[0].robotCommand != null && response[0].robotCommand != '') {
                            checkRobotCommands(response[0].robotCommand);
                        }
                    }
                }
                // on repeats, maybe try to use another response in the array (to change it up and make it variable - don't take the top one always)
                /*
                for (var current in jsonResponse) {
                	if (current == 0) {
                		textToSpeak = jsonResponse[current].verbalResponse;
                	}
                	// how do I know when the update is done - do I care?
                	// log how many records were in the service call JSON response
                	//console.log("id = "+botResponsesList[current].id);
                	console.log(dateTime.create().format('H:M:S.N') + ", response(" + current + ") = " + JSON.stringify(jsonResponse[current]));
                } // loop through JSON list
                */

            }).catch(function (error) {
                console.log("Error in getBotResponses getJSON, err = " + error);
            });
        }

    } // function handleTextFromSpeech(speechText) {

    function checkRobotCommands(cmdStr) {
        if (cmdStr.search("stop") >= 0) {
            sendCommand('{"stop":1}');
        } else if (cmdStr == "walkAbout") {
            sendCommand('{"walkAbout":1}');
        } else if (cmdStr.search("rotate") >= 0) {
            //_rotate(rotateDirection, rotateDuration, rotateDegrees, rotateSpeed);
            sendCommand('{"rotate":1,"rotateDirection":"R","rotateDegrees":' + cmdStr.substr(7) + '}');
        }
    } // function checkRobotCommands(cmdStr) {

    // Respond to string recognized by speech to text (or from search input text box)
    function _cacheJokes() {
        // Get the joke data and cache in an array
        $.getJSON(env.BOT_WEB_URL + "getBotDataProxy.php", "table=jokes" + "&UID=" + env.UID, function (response) {
            //console.log("Number of Jokes = " + response.length);
            //console.log("response = " + JSON.stringify(response));

            if (response.length > 0) {
                for (var current in response) {
                    //console.log("question = " + response[current].question);
                    //console.log("answer = " + response[current].answer);
                    jokeQuestions.push(response[current].question);
                    jokeAnswers.push(response[current].answer);
                } // loop through JSON list
            }
        }).catch(function (error) {
            console.log("Error in getJSON for Jokes, err = " + error);
        });
    }

    function sayAndAnimate(textToSpeak) {
        // Ask the speech module to say the response text
        $("#VerbalRepsonse").html(textToSpeak);
        speech.speakText(textToSpeak);
        // Send text to robot to animate speech (if connected)
        sendCommand('{"textToSpeak" : "' + textToSpeak + '"}');
        lastTextToSpeak = textToSpeak;
    }

    // Main activity loop
    var loopStart = true;
    const activityLoop = setInterval(function () {
        //console.log("In the activityLoop, now = "+Date.now());
        if (loopStart) {
            //sayAndAnimate("Hello, I am the John bought.");
            loopStart = false;
        }

        // put stuff for the state loop in here

        // Track the amount of time that recognizing is off
        /*
        if (elapsedTime > X) {
        	speech.startRecognition();
        	sayAndAnimate("Hello, "+userName+".  Are you still there?");
        }
        */


    }, 1000);

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
        sendCommand,
        sayAndAnimate,
        handleTextFromSpeech
    };

})(); // var identityManagement = (function(){
