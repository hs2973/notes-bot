'use strict';

// set test env variable to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Note = require('../server/models/Note');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Notes', () => {
	beforeEach((done) => { 

		// we empty the collection before each test
		Note.remove({}, (err) => {
			done();
		});
	});

	/**
	 * Test the GET methods
	 */
	describe('/GET notes', () => {
		it ('should GET all the notes', (done) => {
			chai.request(server)
					.get('/api/notes')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0); // the notes collection is empty

						done();
					});
		});
	});

	/**
	 * Test the POST methods
	 */
	describe('/POST notes', () => {
    it('should not POST a note without the author field', (done) => {
      let note = {
        title: "Sample title",
        body: "Sample body"
      }

      chai.request(server)
		      .post('/api/notes')
		      .send(note)
		      .end((err, res) => {
		          res.should.have.status(200);
		          res.body.should.be.a('object');
		          res.body.should.have.property('errors');
		          res.body.errors.should.have.property('pages');
		          res.body.errors.pages.should.have.property('kind').eql('required');
		      
		      done();
      });
    });

    it('it should POST a note ', (done) => {
      let note = {
        title: "Sample title",
        body: "Sample body",
        author: "123"
      }

      chai.request(server)
		      .post('/api/notes')
		      .send(note)
		      .end((err, res) => {
		          res.should.have.status(200);
		          res.body.should.be.a('object');
		          res.body.should.have.property('success').eql(true);
		      
		      done();
      });
    });
  });

 	/**
	 * Test GET note/:id
	 */
  describe('/GET note/:id', () => {
      it('it should GET a note with given id', (done) => {
        let note = new Note({
	        title: "Sample title",
	        body: "Sample body",
	        author: "123"
	      });

        note.save((err, note) => {
            chai.request(server)
            .get('/api/note/' + note.id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('body');
                res.body.should.have.property('author');
                res.body.should.have.property('_id').eql(note.id);
              done();
            });
        });

      });
  });

});
