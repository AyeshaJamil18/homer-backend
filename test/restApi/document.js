//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

const expect = chai.expect;
chai.should(); // activates should, expect and it api
chai.use(chaiHttp);
//Our parent block

describe('Document', function () {
    this.timeout(5000);

    /*
      * Test the /GET route
      */
    describe('/GET document unauthenticated', () => {
        it('should return 401 when unauthenticated', (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.error.should.be.eql('Unauthorized');
                    done();
                });
        });
    });
});
