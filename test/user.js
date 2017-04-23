'use strict';

// set test env variable to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('../server/models/User');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
	beforeEach((done) => { 

		// we empty the collection before each test
		User.remove({}, (err) => {
			done();
		});
	});

	/**
	 *
	 * Test the GET ROUTE
	 *
	 */
	describe('/GET users', () => {
		it ('should GET all the users', (done) => {
			chai.request(server)
					.get('/api/users')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);

						done();
					});
		});
	});

	describe('/GET user/:id', () => {
		it ('should GET a specific user with given id', (done) => {
			chai.request(server)
					.get('/api/user/123')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);

						done();
					});
		});
	});

});
