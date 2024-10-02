import request from 'supertest';
import { expect } from 'chai';
import app from '../server';  // Ensure you export your Express app in server.js

describe('API Endpoints', () => {
  // GET /status
  it('GET /status should return 200 and the correct status', (done) => {
    request(app)
      .get('/status')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('redis').that.equals(true);
        expect(res.body).to.have.property('db').that.equals(true);
        done(err);
      });
  });

  // GET /stats
  it('GET /stats should return 200 with stats on users and files', (done) => {
    request(app)
      .get('/stats')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('users').that.is.a('number');
        expect(res.body).to.have.property('files').that.is.a('number');
        done(err);
      });
  });

  // POST /users
  it('POST /users should create a new user', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email').that.equals('test@example.com');
        done(err);
      });
  });

  // GET /connect
  it('GET /connect should authenticate and return a token', (done) => {
    request(app)
      .get('/connect')
      .auth('test@example.com', 'password')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('token');
        done(err);
      });
  });

  // GET /disconnect
  it('GET /disconnect should log out the user', (done) => {
    request(app)
      .get('/disconnect')
      .set('X-Token', 'someValidToken')
      .expect(204)
      .end((err, res) => {
        done(err);
      });
  });

  // GET /users/me
  it('GET /users/me should return user data for an authenticated user', (done) => {
    request(app)
      .get('/users/me')
      .set('X-Token', 'someValidToken')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email');
        done(err);
      });
  });

  // POST /files
  it('POST /files should upload a file', (done) => {
    request(app)
      .post('/files')
      .set('X-Token', 'someValidToken')
      .send({
        name: 'myfile.txt',
        type: 'file',
        data: 'SGVsbG8gd29ybGQ=', // Base64 encoded 'Hello world'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        done(err);
      });
  });

  // GET /files/:id
  it('GET /files/:id should return a specific file', (done) => {
    request(app)
      .get('/files/60c72b2f5f1e881cc7ba0651')
      .set('X-Token', 'someValidToken')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done(err);
      });
  });

  // PUT /files/:id/publish
  it('PUT /files/:id/publish should publish a file', (done) => {
    request(app)
      .put('/files/60c72b2f5f1e881cc7ba0651/publish')
      .set('X-Token', 'someValidToken')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('isPublic').that.equals(true);
        done(err);
      });
  });

  // PUT /files/:id/unpublish
  it('PUT /files/:id/unpublish should unpublish a file', (done) => {
    request(app)
      .put('/files/60c72b2f5f1e881cc7ba0651/unpublish')
      .set('X-Token', 'someValidToken')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('isPublic').that.equals(false);
        done(err);
      });
  });

  // GET /files/:id/data
  it('GET /files/:id/data should return file content', (done) => {
    request(app)
      .get('/files/60c72b2f5f1e881cc7ba0651/data')
      .set('X-Token', 'someValidToken')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal('Hello world');
        done(err);
      });
  });
});

