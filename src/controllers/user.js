"use strict";

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");
const {createRecordForUserIfNotExistent} = require("./record");

const userModel = require('../models/user');
const groupModel = require('../models/group');
const recordModel = require('../models/record');

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
        .catch(err => {
            log.error(err)
            res.status(500).send();
        })
};

const apiCheckUserEmail = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['userEmail'], req, res)) {
        return;
    }

    userModel.find({email: req.params['userEmail']})
        .then(user => (user && user.length > 0) ?
            user[0].id === req.userId ? res.status(200).send({
                    email: user[0].email,
                    userId: user[0].id,
                    isExist: true,
                    isRequester: true
                })
                : res.status(200).send({email: user[0].email, userId: user[0].id, isExist: true, isRequester: false})
            : res.status(404).send({email: null, userId: null, isExist: false}))
};

const apiFindUserByUsername = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['username'], req, res)) {
        return;
    }

    userModel.find({username: req.params['username']})
        .then(user => (user && user.length > 0) ?
            user[0].username === req.params['username']
                ? res.status(200).send({
                    username: user[0].username,
                    userId: user[0].id,
                    isExist: true,
                    isRequester: true,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName
                })
                : res.status(200).send({
                    username: user[0].username,
                    userId: user[0].id,
                    isExist: true,
                    isRequester: false,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName
                })
            : res.status(404).send({username: null, userId: null, isExist: false}))
};


const addFriend = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['username'], req, res)) {
        return;
    }

    userModel.findOne({username: req.body.username})                                                    // Search for the user to be added
        .then(addedFriend => {
            userModel.findByIdAndUpdate(req.userId, {$addToSet: {friends: addedFriend.username}})    // Find the own user entry and add the user as a friend
                .then(currUser => {
                    addedFriend.update({$addToSet: {friends: currUser.username}})                     // Add yourself as a friend to the other user
                        .then(() => {
                            res.status(200).send();
                        });
                });
        })
        .catch(err => {
            log.error(err)
            res.status(404).send("User couldn't be found.");
        });
};


const apiAddXp = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['xp'], req, res)) {
        return;
    }

    if (!(parseFloat(req.params['xp']) > 0)) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'XP to be added should be a at least 1!'
        });
        return;
    }

    userModel.findById(req.userId).then(currentUser => {
        createRecordForUserIfNotExistent(currentUser.username, res);
        recordModel.findOneAndUpdate({recordUsername: currentUser.username},
            {$inc: {totalPoints: req.params['xp']}})
            .then(() => {
                logger.info("Successfully added " + req.params['xp'] + "XP.")
                res.status(200).send();
            })
            .catch(err => {
                logger.error(err);
                res.status(500).send("XP could not be added.");
            })
    }).catch(err => {
        logger.error(err);
        res.status(500).send("Something went wrong.")
    })
};

const removeFriend = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['username'], req, res)) {
        return;
    }

    userModel.findOne({username: req.body.username})                                                    // Search for the user to be removed
        .then(removedFriend => {
            userModel.findByIdAndUpdate(req.userId, {$pull: {friends: removedFriend.username}})    // Find the own user entry and remove the user as a friend
                .then(currUser => {
                    removedFriend.update({$pull: {friends: currUser.username}})                     // Remove yourself as a friend to the other user
                        .then(() => {
                            res.status(200).send();
                        });
                });
        })
        .catch(err => {
            res.status(404).send("User couldn't be found.");
        });

};

const searchUser = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['match'], req, res)) {
        return;
    }

    userModel.find({
        $expr: {
            $regexMatch: {
                input: {$concat: ["$firstName", " ", "$lastName"]},
                regex: req.params.match,
                options: "i"
            }
        }
    }).then(result => {
        res.status(200).json(result);
    }).catch(() => {
        res.status(500).send("Internal Error");
    });
};

const groups = (req, res) => {
    userModel.findById(req.userId).then(requester => {
        groupModel.find({members: requester.username}, 'title').then(memberGroups => {
            groupModel.find({invited: requester.username}, 'title').then(invitedGroups => {
                res.status(200).json({member: memberGroups, invited: invitedGroups});
            })
        })
    }).catch(err => {
        logger.error(err);
        res.status(500).send();
    })
};

const friends = (req, res) => {
    userModel.findById(req.userId).then(user => {
        userModel.aggregate([
            {$match: {username: user.username}},
            {$lookup: {from: 'users', localField: 'friends', foreignField: 'username', as: 'friends'}}
        ]).then(friends => res.status(200).send(friends[0].friends))
    }).catch(err => {
        logger.error(err);
        res.status(500).send();
    })
};


module.exports = {
    getUserById,
    apiFindUserByUsername,
    apiResolveIdToName,
    apiGetOwnData,
    apiCheckUserEmail,
    addFriend,
    removeFriend,
    searchUser,
    groups,
    apiAddXp,
    friends
};
