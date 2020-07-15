"use strict";

const userModel = require('../models/user');
const groupModel = require('../models/group');

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");
const logger = require('../logger')("controller/auth.js");

const group = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }

    userModel.findById(req.userId).then(requester => {
        groupModel.aggregate([
            { $match: { $and: [ {title: req.params.title}, {$or: [ {members: requester.username}, {invited: requester.username}]}]}},
            { $lookup: { from: 'users', localField: 'members', foreignField: 'username', as: 'members' }},
            { $lookup: { from: 'users', localField: 'invited', foreignField: 'username', as: 'invited' }}
        ]).then(group => res.status(200).json(group[0]));
    }).catch(err => {
        logger.error(err);
        res.status(404).send("Group not found or requester is not a member of the group.")
    })
};

const invite = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title', 'user'], req, res)) {
        return;
    }
    logger.debug("Inviting " + req.params.user + " to the group " + req.params.title);

    userModel.findById(req.userId).then(invitator => {
        userModel.findOne({ username: req.params.user })
            .then(invited => {
                groupModel.findOneAndUpdate({ $and: [ {title: req.params.title}, { members: invitator.username}]},
                    { $addToSet: { invited: invited.username}})
                    .then(() => { res.status(200).send(); })
                    .catch(err => {
                        logger.error(err);
                        res.status(404).send("Group not found or invitator not member of the group.");
                    })
            })
            .catch(err => {
                logger.error(err);
                res.status(404).send("User not found.");
            });
    }).catch(err => {
        logger.error(err);
        res.status(500).send();
    })
}

const join = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }
    logger.debug("User " + req.userId + " joins the group " + req.params.title);

    userModel.findById(req.userId)
        .then(user => {
            groupModel.findOneAndUpdate(
                { $and: [{title: req.params.title}, {invited: user.username}]},
                { $addToSet: { members: user.username }, $pull: { invited: user.username }})
                .then(() => { res.status(200).send(); })
                .catch(err => {
                    logger.error(err);
                    res.status(404).send("Group not found or user not invited");
                })
        })
        .catch(err => {
            logger.error(err);
            res.status(500).send();
        })
}

const leave = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }
    logger.debug("User " + req.userId + " leaves the group " + req.params.title);

    userModel.findById(req.userId)
        .then(user => {
            groupModel.findOneAndUpdate(
                { $and: [{title: req.params.title}, {members: user.username}]},
                { $pull: { members: user.username }})
                .then(() => { res.status(200).send(); })
                .catch(err => {
                    logger.error(err);
                    res.status(404).send("Group not found or user not invited");
                })
        })
        .catch(err => {
            logger.error(err);
            res.status(500).send();
        })
}

const create = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['title', 'invited'], req, res)) {
        return;
    }
    logger.debug("User creates the group " + req.body['title']);

    userModel.findById(req.userId).then(user => {
        groupModel.create({
            title: req.body['title'],
            members: [user.username],
            invited: req.body['invited']
        }).then(() => {
            res.status(200).send();
        }).catch(() => {
            res.status(400).send();
        })
    }).catch(err => {
        logger.error(err);
        res.status(500).send();
    })
}


module.exports = {
    group,
    invite,
    join,
    leave,
    create
};