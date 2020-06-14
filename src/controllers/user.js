"use strict";

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const userModel = require('../models/user');

const logger = require('../logger')("controller/auth.js");

const getUserById = (userId) => {
    logger.debug("User " + userId + " was requested");

    return userModel.findById(userId);
};

const apiGetOwnData = (req, res) => {
    userModel.findById(req.userId, 'username email firstName lastName', {lean: true})
        .then(user => res.status(200).json(user));
};

const apiResolveIdToName = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['userId'], req, res)) {
        return;
    }

    userModel.findById(req.params['userId'])
        .then(user => user ?
            res.status(200).send({username: user.username}) : res.status(404).send("Not found"))
};

const apiCheckUserEmail = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['userEmail'], req, res)) {
        return;
    }

    userModel.find({email: req.params['userEmail']})
        .then(user => (user && user.length > 0) ? 
            user[0].id === req.userId ? res.status(200).send({email: user[0].email, userId: user[0].id, isExist: true, isRequester:true})
                                    : res.status(200).send({email: user[0].email, userId: user[0].id, isExist: true, isRequester:false})
            : res.status(404).send({email: null, userId: null, isExist: false}))
};

module.exports = {
    getUserById,
    apiResolveIdToName,
    apiGetOwnData,
    apiCheckUserEmail
};
