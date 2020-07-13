"use strict";

const userModel = require('../models/user');
const groupModel = require('../models/group');

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");
const logger = require('../logger')("controller/auth.js");

/*
const getGroupById = (groupId) => {
    logger.debug("Group " + groupId + " was requested");

    return groupModel.findById(groupId);
}; */

const group = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }

    groupModel.findOne({ title: req.params.title }, 'title members invited')
        .then(group => res.status(200).json(group));
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

    userModel.findOne({ username: req.params.user })
        .then(user => {
            groupModel.findOneAndUpdate({ title: req.params.title }, { $addToSet: { invited: user.username}})
                .then(() => { res.status(200).send(); });
        })
        .catch(err => {
            logger.error(err);
            res.status(500).send("Internal Error");
        });
}

const join = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['title'], req, res)) {
        return;
    }
    logger.debug("User " + req.params.user + " joins the group " + req.params.title);

    userModel.findById(req.userId)
        .then(user => {
            groupModel.findOneAndUpdate(
                { $and: [{title: req.params.title}, {invited: user.username}]},
                [{ $addToSet: { members: user.username } }, { $pull: { invited: user.username }}])
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
