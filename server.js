/* jshint node: true, devel: true */
"use strict";

// Import dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Connect mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://admin:admin@ds115411.mlab.com:15411/notes-bot/users");
mongoose.connection.on('error', console.error.bind(console, 'mongoose database connection error.'));
mongoose.connection.on('open', function() {
  console.log('Database connected successfully');
});

// Get our API routes
const api = require('./server/routes/api');
const webhook = require('./server/routes/webhook');

const app = express();
app.set('port', process.env.PORT || 5000);

// Parsers for POST data
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.urlencoded({ extended: false }));

// Make dist folder public
app.use(express.static(path.join(__dirname, 'dist')));

// Setting config variables
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ? 
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

if (!(APP_SECRET)) {
  console.error("Missing config value: APP_SECRET");
  process.exit(1);
}

// Set our api routes
app.use('/api', api);
app.use('/webhook', webhook);

// Serve index.html page from the dist folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an 
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;