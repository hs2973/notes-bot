"use strict";

var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

var userSchema = new Schema({
	facebook_id: { type: String, required: true },
	first_name: String,
	last_name: String,
	email: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date }
});

userSchema.pre('save', function (next) {

	// get current data
  var currentDate = new Date();

  // change updateAt field to currentDate
  this.updatedAt = currentDate;

  if (!this.createdAt) {
  	this.createdAt = currentDate;
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