"use strict";

const uuid = require("uuid/v4");

const createUserObject = (email, username, firstName, lastName, password) => {
    const userObj = {email: email, username: username, firstName: firstName, lastName: lastName, password: password};

    userObj.loginObj = () => extractUserLoginObj(userObj);

    return userObj;
};

const extractUserLoginObj = (userObj) => {
    return {email: userObj['email'], password: userObj['password']}
};

const createRandomUserObject = () => {
    return createUserObject(uuid() + '@invalidEmailServer.com',
        uuid().replace(/-/g, ''),
        uuid(),
        uuid(),
        uuid().substring(0, 29));
};



module.exports = {
    createUserObject,
    createRandomUserObject
};
