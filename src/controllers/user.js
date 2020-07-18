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

    userModel.findById(req.userId).then(currentUser => {
        createRecordForUserIfNotExistent(currentUser.username,req.params['xp'] , res);
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
            logger.error(err)
            res.status(404).send("User couldn't be found.");
        });

};

const searchUser = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['match'], req, res)) {
        return;
    }

    const nomemberof = req.query.nomemberof;
    const nofriendof = req.query.nofriendof;

    logger.info("nomemberof: " + nomemberof + ". nofriendof: " + nofriendof);

    userModel.findOne({username: nofriendof}).then(user => {
        groupModel.findOne({title: nomemberof}).then(group => {
            userModel.find({
                $expr: {
                    $regexMatch: {
                        input: {$concat: ["$firstName", " ", "$lastName"]},
                        regex: req.params.match,
                        options: "i"
                    }
                }
            }).then(result => {
                logger.info("raw result of user search: " + result)
                if (!(nofriendof == null || user == null)) {
                    result = result.filter(entry => !user.friends.includes(entry.username))
                    logger.info("result of user search after filtering out friends of : " + nofriendof + ":" + result)
                }
                if (!(nomemberof == null || group == null)) {
                    result = result.filter(entry => !group.members.includes(entry.username))
                    logger.info("result of user search after filtering out members of : " + nomemberof + ":" + result)
                }
                result = result.slice(0, 10)
                logger.info("result of user search after limiting search result to 10: " + result)
                res.status(200).json(result);
            }).catch(() => {
                res.status(500).send("Internal Error");
            });
        });
    }).catch(err => {
        logger.error(err);
        res.status(400).send();
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
