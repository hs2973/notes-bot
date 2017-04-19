/* jshint node: true, devel: true */
"use strict";

// Import dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.set('port', process.env.PORT || 5000);

// Make dist folder public
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html page from the dist folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;