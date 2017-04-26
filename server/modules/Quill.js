'use strict';

/**
 * NoteTaker class
 */
class Quill {

	/*
	 * Method to get notes from the database
	 * @params: owner: String, count: Number, from: Date 
	 *
	 */

	 addText(note, text) {
	 	text = text + '\n';

	 	var tmp = {
	 		insert: text
	 	}

	 	note.body.ops.push(tmp);
	 	note.body.ops.push({"insert":"\n"});
	 	note.text += text;
	 }


}

exports = module.exports = new Quill();
