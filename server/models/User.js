"use strict";

var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

var noteSchema = new Schema({
	id: { type: Number, required: true },
	title: { type: String, default: 'Untitled' },
	body: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date }
});

noteSchema.pre('save', function (next) {
  console.log("Note saved: " + this);

  // get current data
  var currentDate = new Date();

  // change updateAt field to currentDate
  this.updatedAt = currentDate;

  if (!this.createdAt) {
  	this.createdAt = currentDate;
  }

  next();
});

var userSchema = new Schema({
	facebook_id: { type: String, required: true },
	first_name: String,
	last_name: String,
	email: String,
	notes: [noteSchema],
	createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {

	if (!this.createdAt) {
		this.createdAt = new Date();
	}

	next();
});

userSchema.methods.getFullName = function () {
	return this.first_name + " " + this.last_name;
};

userSchema.methods.getNotes = function () {
	return this.notes;
};

var User = mongoose.model("User", userSchema);

module.exports = User;