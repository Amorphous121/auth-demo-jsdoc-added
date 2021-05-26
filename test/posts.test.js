process.env.NODE_ENV = 'test';
process.env.PORT = 8082;
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../index');

const POST = require('../models/posts-model');
const USER = require('../models/users-model');

chai.use(chaiHttp);

describe('POST API Test', () => {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwYWI3ZmIwN2JhODNhMTI1MDJjOTQxOCIsInVzZXJuYW1lIjoiYWRtaW4xMjEiLCJyb2xlIjoiNjBhYjdmYjA3YmE4M2ExMjUwMmM5NDE1In0sImlhdCI6MTYyMTg1MjEyOX0.8z_Edy9f3zMy8ReL-EqV34qcvDfIVMQQdK9KsOH4SEk'
    let id = '60ab7fb07ba83a12502c9418';

    before((done) => {
        USER.deleteMany( { username : { $ne : 'admin121', }}, (err, result) => {
            POST.deleteMany({}, (err, result) => {
                if(err)
                    done(err);
                done();
            });
        });
    })


    context('/POST CREATE POST', () => {

        it('should create a post', (done) => {
            const user = {
                name : 'ganesh',
                username : "ganesh121",
                password : "1234"
            }

            const post = {
                content : 'Gujarat is the best place for tourisum',
                title : 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, result) => {
                    if (err)
                        done(err);

                    chai.request(server)
                    .post('/api/users/login')
                    .send({ username : 'ganesh121', password : "1234" })
                    .end((err, result) => {
                        if (err)
                            done(err);

                        const { token } = result.body.data;

                        chai.request(server)
                            .post('/api/posts/')
                            .auth(token, { type : 'bearer'})
                            .send(post)
                            .end((err, res) => {
                                if (err)
                                    done(err);

                                expect(res).to.have.status(201);
                                expect(res.body).to.be.a('object');
                                expect(res.body).to.have.property('status', true).to.be.a('boolean');
                                expect(res.body.data).to.include.all.keys('user', '_id', 'title', 'content');
                                done()
                            })
                    })
                })
        })
    })

    context("/GET POST", () => {
        it('should give all the list of posts', (done) => {
            chai.request(server)
                .get('/api/posts/')
                .auth(token, { type : 'bearer'})
                .end((err, res) => {
                    if (err) 
                        done(err);
                    
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                    expect(res.body).to.have.property('data').that.is.a('array').that.is.not.empty;
                    expect(res.body.data[0]).to.include.all.keys('user', 'comments', '_id', 'title', 'content');
                    done();
                })
        })
    })

    context('/GET/:id Get a single post', () => {
        it('should return a post object of given id ', (done) => {
            const post = {
                content : 'Gujarat is the best place for tourisum',
                title : 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type : 'bearer' })
                .send(post)
                .end((err, res) => {
                    if(err)
                        done(err);
                    chai.request(server)
                        .get('/api/posts/' + res.body.data._id)
                        .auth(token, { type : 'bearer'})
                        .end((err, res) => {
                            if(err)
                                done(err);

                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('status', true);
                            expect(res.body.data).to.be.a('object');
                            expect(res.body.data).to.have.all.keys('_id', 'title', 'content', 'user', 'comments');
                            done();
                        })
                })
        })
    })

    context('/PUT public post', () => {
        it('it should updata the post', (done) => {
            const post = {
                content : 'Gujarat is the best place for tourisum',
                title : 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type : 'bearer'})
                .send(post)
                .end((err, result) => {
                    if (err) 
                        done(err);

                    chai.request(server)
                        .put('/api/posts/' + result.body.data._id)
                        .auth(token, { type : 'bearer'})
                        .send({ content : 'Maharashtra is the best place for tourism'})
                        .end((err, res) => {
 
                            if (err)
                                done(err);
                            expect(res).to.have.status(200)
                            expect(res.body).to.have.property('status', true).to.be.a('boolean');
                            expect(res.body).to.have.property('data').to.include.keys('_id', 'user', 'title', 'content');
                            expect(res.body.data).to.be.a('object');
                            done();
                        })
                })
        })
    })

    context('/DELETE the post', () => {
        it('should delete the post of given id', (done) => {
            const post = {
                content : 'Gujarat is the best place for tourisum',
                title : 'A beautiful journey'
            }

            chai.request(server)
                .post('/api/posts/')
                .auth(token, { type : 'bearer'})
                .send(post)
                .end((err, result) => {
                    if (err)
                        done(err);

                    chai.request(server)
                        .delete('/api/posts/' + result.body.data._id)
                        .auth(token, { type : 'bearer'})
                        .end((err, res) => {
                            if (err)
                                done(err);
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('status', true).to.be.a('boolean');
                            expect(res.body).to.have.property('message').to.be.a('string').not.have.lengthOf(0);
                            done();
                        })
                })
        })
    })

})