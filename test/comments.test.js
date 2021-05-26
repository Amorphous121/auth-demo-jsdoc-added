process.env.NODE_ENV = 'test';
process.env.PORT = 8082;
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../index');

const POST = require('../models/posts-model');
const USER = require('../models/users-model');
const COMMNENT = require('../models/comments-model');

chai.use(chaiHttp);

describe('POST API Test', () => {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwYWI3ZmIwN2JhODNhMTI1MDJjOTQxOCIsInVzZXJuYW1lIjoiYWRtaW4xMjEiLCJyb2xlIjoiNjBhYjdmYjA3YmE4M2ExMjUwMmM5NDE1In0sImlhdCI6MTYyMTg1MjEyOX0.8z_Edy9f3zMy8ReL-EqV34qcvDfIVMQQdK9KsOH4SEk'
    let id = '60ab7fb07ba83a12502c9418';

    before((done) => {
        USER.deleteMany({ username: { $ne: 'admin121', } }, (err, result) => {
            POST.deleteMany({}, (err, result) => {
                if (err)
                    done(err);
                COMMNENT.deleteMany({}, (err, res) => {
                    if (err)
                        done(err);
                    done();
                })
            });
        });
    })

    context('/POST Create comment', () => {
        it('should create a new comment on given post', (done) => {

            const post = {
                content: 'Gujarat is the best place for tourisum',
                title: 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type: 'bearer' })
                .send(post)
                .end((err, result) => {
                    if (err)
                        done(err);
                    chai.request(server)
                        .post('/api/comments/')
                        .auth(token, { type: 'bearer' })
                        .send({ comment: 'Nice ', post: result.body.data._id })
                        .end((err, res) => {
                            if (err)
                                done(err);
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('status', true);
                            expect(res.body).to.have.property('data').that.is.a('object');
                            expect(res.body.data).to.have.all.keys('_id', 'user', 'comment', 'post');
                            done();
                        })
                })
        })
    })


    context('/GET all the comments', () => {
        it('should return an array of all the comments', (done) => {
            chai.request(server)
                .get('/api/comments/')
                .auth(token, { type: 'bearer' })
                .end((err, res) => {
                    if (err)
                        done(err);

                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                    expect(res.body).to.have.property('data').that.is.a('array').that.is.not.empty;
                    expect(res.body.data[0]).to.have.all.keys('_id', 'comment', 'user', 'post');
                    done();
                })
        })
    })

    context('/GET get a single comment', () => {
        it('should return a single comment object of given id', () => {
            const post = {
                content: 'Gujarat is the best place for tourisum',
                title: 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type: 'bearer' })
                .send(post)
                .end((err, result) => {
                    if (err)
                        done(err);

                    chai.request(server)
                        .post('/api/comments/')
                        .auth(token, { type: 'bearer' })
                        .send({ comment: "very good ", post: result.body.data._id })
                        .end((err, result) => {
                            if (err)
                                done(err);

                            chai.request(server)
                                .get('/api/comments/' + result.body.data._id)
                                .auth(token, { type: 'bearer' })
                                .end((err, res) => {
                                    if (err)
                                        done(err);

                                    expect(res).to.have.status(200);
                                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                                    expect(res.body).to.have.property('data').that.is.a('object');
                                    expect(res.body.data).to.have.all.keys('_id', 'comment', 'user', 'post');
                                })
                        })
                })
        })
    })

    context('/PUT Update comment', () => {
        it('should update the comment of given id', (done) => {
            const post = {
                content: 'Gujarat is the best place for tourisum',
                title: 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type: 'bearer' })
                .send(post)
                .end((err, result) => {
                    if (err)
                        done(err);

                    chai.request(server)
                        .post('/api/comments/')
                        .auth(token, { type: 'bearer' })
                        .send({ comment: "very good ", post: result.body.data._id })
                        .end((err, result) => {
                            if (err)
                                done(err);

                            chai.request(server)
                                .put('/api/comments/' + result.body.data._id)
                                .auth(token, { type: 'bearer' })
                                .send({ comment: 'Vary very nice ' })
                                .end((err, res) => {
                                    if (err)
                                        done(err);

                                    expect(res).to.have.status(200);
                                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                                    expect(res.body.data).to.be.a('object');
                                    expect(res.body.data).to.include.all.keys('_id', 'comment', 'user', 'post');
                                    done();
                                })
                        })


                })
        })
    })

    context('/DELETE Delte the comment', () => {
        it('should delete the comment of given id', (done) => {
            const post = {
                content: 'Gujarat is the best place for tourisum',
                title: 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type: 'bearer' })
                .send(post)
                .end((err, result) => {
                    if (err)
                        done(err);

                    chai.request(server)
                        .post('/api/comments/')
                        .auth(token, { type: 'bearer' })
                        .send({ comment: "Delete me ", post: result.body.data._id })
                        .end((err, result) => {
                            if (err)
                                done(err);

                            chai.request(server)
                                .delete('/api/comments/' + result.body.data._id)
                                .auth(token, { type: 'bearer' })
                                .end((err, res) => {
                                    if (err)
                                        done(err); 

                                    expect(res).to.have.status(200);
                                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                                    expect(res.body.data).to.be.a('object');
                                    expect(res.body.data).to.have.property('message').to.be.a('string').that.is.not.empty;
                                    done();
                                })
                        })
                })
        })
    })
})