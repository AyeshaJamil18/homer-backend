//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

const jwt = require('jsonwebtoken');

const userHelper = require('./helper/user');
const authHelper = require('./helper/auth');

const expect = chai.expect;
chai.should(); // activates should, expect and it api
chai.use(chaiHttp);
//Our parent block
describe('Auth', function () {
    this.timeout(5000);

    /*
      * Test the /GET route
      */
    describe('/GET user unauthenticated', () => {
        it('should return 401 when unauthenticated', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.error.should.be.eql('Unauthorized');
                    done();
                });
        });
    });

    describe('/GET user authentication routine', () => {

        const validateToken = (token, userObject) => {
            const decodeToken = jwt.decode(token);

            expect(decodeToken.email).to.be.eq(userObject.email);

            expect(decodeToken.id).to.exist;
            expect(decodeToken.id.length).to.be.at.least(10);

            const currentDate = Date.now() / 1000;
            expect(decodeToken.iat < currentDate).to.be.true;
            expect(currentDate < decodeToken.exp).to.be.true;
        };

        it('should return token when user is created', (done) => {
            const userObject = userHelper.createRandomUserObject();

            authHelper.createUser(userObject)
                .end((err, res) => {
                    res.should.have.status(200);

                    const parsedJson = JSON.parse(res.text);

                    expect(parsedJson).to.have.property('token');

                    validateToken(parsedJson['token'], userObject);

                    done();
                })
        });

        it('should return token when user logs in', (done) => {
            const userObject = userHelper.createRandomUserObject();

            authHelper.createUser(userObject).then(() => {
                authHelper.login(userObject.loginObj())
                    .end((err, res) => {
                        res.should.have.status(200);

                        const parsedJson = JSON.parse(res.text);

                        expect(parsedJson).to.have.property('token');

                        validateToken(parsedJson['token'], userObject);

                        done();
                    });
            });
        });
    })
});
