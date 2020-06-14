"use strict";

let chai = require('chai');
const server = require('../index');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

before(async function () {
    this.timeout(15000);
    await awaitServerPong();


    return Promise.resolve();
});

const awaitServerPong = async () => {
    let response = '';
    do {
        console.log('Check if server is up');
        response = await chai.request(server).get('/health/ping');
    } while (response.text !== 'pong');

    console.log('Server is ready')
};
