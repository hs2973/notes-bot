'use strict';

/**
 * Module Dependencies
 */
 const axios = require('axios');

/**
 * NoteTaker class
 */
class NoteTaker {

	createNote(sender, message) {
		console.log("Note being created for %s with '%s'.", sender, message);
	}

	/*
	 * Method to get notes from the database
	 * @params: owner: String, count: Number, from: Date 
	 *
	 */
	getNotes(owner, count, from, completion, error) {

		// Make the get request to the server
		axios.get('http://localhost:5000/api/notes')
			.then(function(response) {
				console.log(response.data);
				completion(response);
			})
			.catch(function(err){
				error(err);
			});

	}

	/*
	 * Method to get a single from the database
	 * @params: owner: String, id: String, completion: Function, error: Function
	 *
	 */
	getNote(owner, id, completion, error) {

		// Make the get request to backend server
		axios.get('/api/note/' + id)
			.then(function(response) {
				completion(response);
			})
			.catch(function(err) {
				error(err);
			});

	}

}

exports = module.exports = new NoteTaker();
