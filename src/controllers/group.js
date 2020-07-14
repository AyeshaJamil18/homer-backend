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
        groupModel.findOne({ $and: [ {title: req.params.title}, {$or: [ {members: requester.username}, {invited: requester.username}]}]}, 'title members invited')
            .then(group => res.status(200).json(group));
    }).catch(err => {
        logger.error(err);
        res.status(404).send("Group not found or requester is not a member of the group.")
    })
};

const add = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title', 'user'], req, res)) {
        return;
    }
    logger.debug("User " + req.params.user + " is added to the group " + req.params.title);

    userModel.findOneAndUpdate({ username: req.params.user }, { $addToSet: { groups: req.params.title }})
        .then(user => {
            groupModel.findOneAndUpdate({ title: req.params.title }, { $addToSet: { members: user.username}})
                .then(() => { res.status(200).send(); });
        })
        .catch(err => {
            logger.error(err);
            res.status(500).send("Internal Error");
        });
}

const remove = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title', 'user'], req, res)) {
        return;
    }
    logger.debug("User " + req.params.user + " is removed from the group " + req.params.title);

    userModel.findOneAndUpdate({ username: req.params.user }, { $pull: { groups: req.params.title }})
        .then(user => {
            groupModel.findOneAndUpdate({ title: req.params.title }, { $pull: { members: user.username}})
                .then(() => { res.status(200).send(); });
        })
        .catch(err => {
            logger.error(err);
            res.status(500).send("Internal Error");
        });
}

const invite = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title', 'user'], req, res)) {
        return;
    }
    logger.debug("Inviting " + req.params.user + " to the group " + req.params.title);

    userModel.findById(req.userId).then(invitator => {
        userModel.findOne({ username: req.params.user })
            .then(invited => {
                groupModel.findOneAndUpdate({ $and: [ {title: req.params.title}, { members: invitator.username}, { $not: {members: invited.username}}] },
                    { $addToSet: { invited: invited.username}})
                    .then(() => { res.status(200).send(); })
                    .catch(err => {
                        logger.error(err);
                        res.status(404).send("Group not found or invitator not member of the group or invited user already in the group.");
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
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }
    logger.debug("User creates the group " + req.params.title);
}


module.exports = {
    //getGroupById,
    group,
    add,
    remove,
    invite,
    join,
    leave,
    create
};
