"use strict";

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

var User = require('../models/User');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get user
var getUser = function(id, res, callback) {
  
  if (!id) {
    res.status(404).send( { success: false, message: "Empty user id."});
    return;
  }

  User.find({ facebook_id: id.toString() }, function (err, users){
    if (err) throw err;

    if(users.length !== 1) {
      res.status(404).send({ success: false, message: 'No user found!' });
      return;
    }

    callback(users[0]);
  });
};

// Get a single note with a specific id
router.get('/note/:id', (req, res) => {
  var id = req.params.id;

  getUser(123, res, function(user) {

    user.notes.forEach(function(note) {
      if (note.id == id) {
        res.status(200).json(note);
        return;
      }
    });

  });

});

// Get all notes
router.get('/notes', (req, res) => {

  getUser(123, res, function(user) {
    res.status(200).json(user.notes);
  });
  
});

// Post a note
router.post('/notes', (req, res) => {

  // check if the body is empty
  if (!req.body.body) {
    res.status(404).send( { success: false, message: 'Empty note body.'});
    return;
  }

  getUser(req.body.author, res, function(user) {
    
    // create a note
    var note = {
      title: req.body.title,
      body: req.body.body
    };

    // add the note to users.notes collection
    if (user.notes.length === 0) {
      note.id = 1;
    } else {
      note.id = user.notes[user.notes.length - 1].id + 1;
    }

    user.notes.push(note);

    // save the user
    user.save(function(err) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note posted successfully'
      });
    });
  });

});

router.post('/signup', (req, res) => {

  var user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    facebook_id: req.body.facebook_id,
    email: req.body.email,
    notes: []
  });

  console.log(user);

  user.save(function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    }

    console.log('user created successfully');
    res.status(200).json({ success: true, message: 'User created successfully.'});
  });

});

module.exports = router;