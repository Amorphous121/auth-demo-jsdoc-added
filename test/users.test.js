process.env.NODE_ENV = 'test';
process.env.PORT = 8082;
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../index');

const USER = require('../models/users-model');



chai.use(chaiHttp);

describe('USERs API Test', () => {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwYWI3ZmIwN2JhODNhMTI1MDJjOTQxOCIsInVzZXJuYW1lIjoiYWRtaW4xMjEiLCJyb2xlIjoiNjBhYjdmYjA3YmE4M2ExMjUwMmM5NDE1In0sImlhdCI6MTYyMTg1MjEyOX0.8z_Edy9f3zMy8ReL-EqV34qcvDfIVMQQdK9KsOH4SEk'
    let id = '60ab7fb07ba83a12502c9418';

    before((done) => {
        USER.deleteMany( { username : { $ne : 'admin121', }}, (err, result) => {
            done();
        });
    })

    context('/POST User', () => {

        it('should register the user ', (done) => {

            let user = {
                "name": "roshan",
                "username": "roshan124",
                "password": "1234"
            }

            
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {

                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                    expect(res.body).to.have.property('data').to.be.a('object');
                    expect(res.body.data).to.include.all.keys('role', '_id', 'name', 'username');
                    expect(res.body.data).to.not.have.property('password');
                    done();
                })
        })

    })

    context('/POST LOGIN', () => {
        it('should login user and give token back', (done) => {
            let user = { 
                username : "roshan124",
                password : '1234'
            }
    
            chai.request(server)
                .post('/api/users/login')
                .send(user)
                .end((err, res) => {
                    
                    if (err)
                        done(err);
                    
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.own.property('status', true).to.be.a('boolean');
                    expect(res.body).to.include.all.keys('status', 'data');
                    expect(res.body.data).to.have.property('token');
                    done();
                })
        })
    })

    context('/GET User API', () => {
        
        it('should get all the users', (done) => {
            chai.request(server)
             
                .get('/api/users/')
                .auth(token, { type : 'bearer'})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', true);
                    expect(res.body).to.have.property('data').that.is.a('array');
                    expect(res.body).to.have.property('data').that.not.have.lengthOf(0);
                    expect(res.body).to.have.all.keys('status', 'data');
                    done()
                })
        })
    })

    context('/GET user api', () => {
        it('should not give any result with wrong token and should say unauthorized', (done) => {
            chai.request(server)
                .get('/api/users/')
                .auth(token + '1', { type : 'bearer'})
                .end((err, res) => {
                    if(err)
                        done(err);
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('status', false);
                    done();
                })
        })
    })


    context('/GET/:id', () => {
        it('should return a user object of specified id', (done) => {
            chai.request(server)
                .get('/api/users/' + id)
                .auth(token, { type : 'bearer'})
                .end((err, res) => {
                    if (err)
                        done(err);

                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', true).to.be.a('boolean');
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.all.keys('username', '_id', 'name', 'posts', 'comments');
                    expect(res.body.data).to.have.property('posts').that.is.a('array');
                    expect(res.body.data).to.have.property('comments').that.is.a('array');
                    expect(res.body.data).to.have.property('_id').eqls(id);
                    done();
                });
        })
    });

    context('/PUT Udpdate user' , () => {
        it('should update the user info', (done) => {
            chai.request(server)
            .put('/api/users/' + id)
            .auth(token, { type : 'bearer'})
            .send({ name : 'Prathamesh'})
            .end((err, res) => {
                if (err)
                    done(err)
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('status', true).that.is.a('boolean');
                expect(res.body.data).to.have.all.keys('name', 'username', '_id');
                expect(res.body.data).to.have.property('_id').eqls(id);
                done();
            })
        })
    })

    context('/DELETE Delete Existing user ', () => {
        it('should delete the user of given id', (done) => {
            
            let demoUser = {
                name : 'demo Person',
                username : 'demoUsername',
                password : '1234'
            }

            USER.create(demoUser, (err, data) => {
                if (err)
                    done(err);
                
                chai.request(server)
                .delete('/api/users/' + data._id )
                .auth(token, { type : 'bearer'})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('status', true).that.is.a('boolean');
                    expect(res.body).to.have.property('message', 'User deleted succssfully').to.be.a('string');
                    done();
                })
            });
            
            
        })
    })
})