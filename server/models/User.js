"use strict";

var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

var noteSchema = new Schema({
	title: String,
	body: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date }
});

noteSchema.pre('save', function (next) {
  console.log("Note saved: " + this);
  next();
});

var userSchema = new Schema({
	facebook_id: String,
	first_name: String,
	last_name: String,
	notes: [noteSchema],
	createdAt: { type: Date, default: Date.now }
});

userSchema.methods.getFullName = function () {
	return this.first_name + " " + this.last_name;
};

userSchema.methods.getNotes = function () {
	return this.notes;
};

var User = mongoose.model("User", userSchema);

module.exports = User;