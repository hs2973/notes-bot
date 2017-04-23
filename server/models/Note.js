"use strict";

var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

var noteSchema = new Schema({
	id: { type: Number, required: true },
	title: { type: String, default: 'Untitled' },
	body: { type: String, required: true },
  author: { type: String, required: true },
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

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;