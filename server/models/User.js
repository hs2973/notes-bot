"use strict";

var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

var userSchema = new Schema({
	facebook_id: { type: String, required: true },
	first_name: String,
	last_name: String,
	email: String,
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