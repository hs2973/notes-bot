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

	 addAttachments(note, attachments) {

	 	for (var i = 0; i < attachments.length; i++) {
	 		var tmp = {
	 			insert: {}
	 		};

	 		tmp.insert[attachments[i].type] = attachments[i].payload.url;
	 		note.body.ops.push(tmp);
	 		note.body.ops.push({"insert":"\n"});
	 	}
	 	
	 }


}

exports = module.exports = new Quill();
