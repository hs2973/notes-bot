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
var getUser = function(id) {
  console.log(id);

  User.find({ facebook_id: '123' }, function (err, user){
    if (err) throw err;

    return user;
  });
};

// Get all posts
router.get('/notes', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.post('/note', (req, res) => {

  // check if the body is empty
  if (!req.body.body) {
    res.status(404).send( { success: false, message: 'Empty note body.'});
    return;
  }

  User.find({ facebook_id: req.body.id.toString() }, function (err, users){
    if (err) throw err;

    // check if the user is valid
    if (users.length !== 1) {
      res.status(404).send({ success: false, message: 'No user found!'});
      return;
    }

    var user = users[0];

    console.log(user);

    var note = {
      title: req.body.title,
      body: req.body.body
    };

    console.log(user.notes);
    user.notes.push(note);

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