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
	 * Test the GET methods
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

	/**
	 * Test the POST methods
	 */
	describe('/POST users', () => {
    it('should not POST a user without the facebook id', (done) => {
      let user = {
        first_name: "John",
        last_name: "Doe"
      }

      chai.request(server)
		      .post('/api/users')
		      .send(user)
		      .end((err, res) => {
		          res.should.have.status(200);
		          res.body.should.be.a('object');
		          res.body.should.have.property('errors');
		      
		      done();
      });
    });

    it('it should POST a user ', (done) => {
      let user = {
        first_name: "John",
        last_name: "Doe",
        facebook_id: "123"
      }

      chai.request(server)
		      .post('/api/users')
		      .send(user)
		      .end((err, res) => {
		          res.should.have.status(200);
		          res.body.should.be.a('object');
		          res.body.should.have.property('success').eql(true);
		      
		      done();
      });
    });
  });

 	/**
	 * Test GET user/:id
	 */
  describe('/GET user/:id', () => {
      it('it should GET a user with given id', (done) => {
        let user = new User({
	       	first_name: "John",
	        last_name: "Doe",
	        facebook_id: "123"
	      });

        user.save((err, user) => {
            chai.request(server)
            .get('/api/user/' + user.id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('first_name');
                res.body.should.have.property('last_name');
                res.body.should.have.property('facebook_id');
                res.body.should.have.property('_id').eql(user.id);
              done();
            });
        });

      });
  });

});
