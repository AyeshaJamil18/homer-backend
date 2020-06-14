"use strict";

const chaiHttp = require("chai-http");
const chai = require('chai');

let server = require('../../../index');

chai.use(chaiHttp);
const createUser = (userObj) => {
    return chai.request(server)
        .post('/auth/register',)
        .send(userObj);
};

const login = (userLoginObj) => {
    return chai.request(server)
        .post('/auth/login')
        .send(userLoginObj);
};

const addAuthHeader = (chaiObj, token) => {
    chaiObj.set('authorization', 'Bearer ' + token);
};

module.exports = {
    createUser,
    login,
    addAuthHeader
};
