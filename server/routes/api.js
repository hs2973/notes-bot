"use strict";

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

var User = require('../models/User');
var Note = require('../models/Note');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get a single user
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

/*=================================
=            Users API            =
=================================*/

/**
 *
 * GET /users
 * Should return all the users in the database
 */
router.get('/users', (req, res) => {
  User.find({}, function(err, users) {
    if (err) res.send(err);

    res.json(users);
  });
});

/**
 *
 * GET /user/:id
 * Should return a user with a specific id
 */
router.get('/user/:id', (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) res.send(err);

    res.json(user);
  });
});

/**
 *
 * POST /users
 * Should create a new user
 */
router.post('/users', (req, res) => {

  var user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    facebook_id: req.body.facebook_id,
    email: req.body.email
  });

  // check if a user already exists or not
  // if the user exists, do not create a new account but instead update it.
  User.findOne({ facebook_id: req.body.facebook_id }, function(err, user) {
    if (err) res.send(err);

    if (user) {
      // update existing user
      user.first_name = (req.body.first_name != null) ? req.body.first_name : user.first_name;
      user.last_name = (req.body.last_name != null) ? req.body.last_name : user.last_name;
      user.email = (req.body.email != null) ? req.body.email : user.email;
    } 
    else {
      // create a new user  
      user = new User({
        facebook_id: req.body.facebook_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
      });
    }

    user.save(function (err) {
      if (err) {
        res.send(err);
        return;
      }

      res.json({ success: true, message: 'User created successfully.'});
    });

  });
});

/*=====  End of Users API  ======*/



/*=================================
=            Notes API            =
=================================*/

/**
 *
 * GET /notes
 * Should return all notes
 */
router.get('/notes', (req, res) => {
  Note.find({}, function(err, notes) {
    if (err) res.send(err);

    res.json(notes);
  });
});

/**
 *
 * GET /note/:id
 * Should return a note with a specific id
 */
router.get('/note/:id', (req, res) => {
  Note.findById(req.params.id, function(err, note) {
    if (err) res.send(err);

    res.json(note);
  });
});


/**
 *
 * POST /notes
 * Should create a new note
 */
router.post('/notes', (req, res) => {

  var note = new Note({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author
  });

  note.save(function (err) {
    if (err) { 
      res.send(err);
      return;
    }

    res.json({ success: true, message: 'Note created successfully.'});
  });

});

/**
 *
 * DELETE /note/:id
 * Should a note with specific id
 */
router.delete('/note/:id', (req, res) => {

  Note.remove({_id : req.params.id}, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }

    res.json({ success: true, message: "Note successfully deleted!" });
  });

});
/*=====  End of Notes API  ======*/



module.exports = router;