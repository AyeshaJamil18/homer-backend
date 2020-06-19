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

const apiFindUserByUsername = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['username'], req, res)) {
        return;
    }

    userModel.find({username: req.params['username']})
        .then(user => (user && user.length > 0) ?
            user[0].username === req.params['username'] ? res.status(200).send({username: user[0].username, userId: user[0].id, isExist: true, isRequester:true})
                : res.status(200).send({username: user[0].username, userId: user[0].id, isExist: true, isRequester:false})
            : res.status(404).send({username: null, userId: null, isExist: false}))
};


const apiAddFriend = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['username'], req, res)) {
        return;
    }

    let idOfFriend = "";
    userModel.find({username: req.params['username']})
        .then(user => idOfFriend = user[0]._id)

    let usernameOfCurrentUser = "";
    userModel.findById(req.userId, 'username', {lean: true})
        .then(user => usernameOfCurrentUser = user[0].username);

    // add new friend to friends of current user
    userModel.update(
        { _id: req.userId },
        { $addToSet: { friends: req.params['friendUsername']}},
        );

    // add current user to friends of new friend
    userModel.update(
        { _id: idOfFriend },
        { $addToSet: { friends: usernameOfCurrentUser}},
    );

    // check whether friend was added correctly and return status code accordingly
    // TODO: check also the other way round (search in friends list of new friend for username of current user)
    userModel.findById(req.userId, 'username friends', {lean: true})
        .then(user => ((user && user.length > 0 && user[0].friends.includes(req.params['friendUserName'])))
            ? res.status(200).send({username: user[0].username, friends: user[0].friends})
            : res.status(404).send({username: user[0].username, friends: user[0].friends}))
};


module.exports = {
    getUserById,
    apiFindUserByUsername,
    apiResolveIdToName,
    apiGetOwnData,
    apiCheckUserEmail,
    apiAddFriend
};
