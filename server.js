/*==============================================================================
(C) Copyright 2019 John J Kauflin, All rights reserved. 
-----------------------------------------------------------------------------
DESCRIPTION: NodeJS server for JohnChat to run a web app and the
             communications to the Arduino Mega robot
-----------------------------------------------------------------------------
Modification History
2017-09-23 JJK  Initial version to test web
2019-03-16 JJK  Separated the Chatbot and this local server into a 
                different repository
=============================================================================*/

// General handler for any uncaught exceptions
process.on('uncaughtException', function (e) {
  console.log("UncaughtException, error = " + e);
  console.error(e.stack);
  // Stop the process
  // 2017-12-29 JJK - Don't stop for now, just log the error
  //process.exit(1);
});

// Read environment variables from the .env file
require('dotenv').config();

const http = require('http');
var dateTime = require('node-datetime');

// WebSocket URL to give to the client browser to establish ws connection
var wsUrl;
// Create a web server
var express = require('express');
var app = express();
var webServer;
// If running local server just use HTTP, else use HTTPS
webServer = new http.createServer(app)
    .listen(process.env.WEB_PORT, function () {
      console.log("Live at Port " + process.env.WEB_PORT + " - Let's rock!");
});

app.get('/dotenv.php', function (req, res, next) {
  var env = {
    "wsUrl": process.env.WS_URL,
    "BOT_WEB_URL": process.env.BOT_WEB_URL,
    "UID": process.env.UID
  }
  res.send(env);
})

app.use('/',express.static('public'));

app.use("*",function(req,res){
  console.log("Not in Public, URL = "+req.url);
  res.sendFile(path + "404.html");
});
 
// jjk new
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
