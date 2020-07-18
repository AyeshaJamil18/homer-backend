"use strict";

const {createLeaderboardIfNotExistent} = require("./leaderboard");

const recordModel = require('../models/record');
const leaderboardModel = require('../models/leaderboard');

const logger = require('../logger')("controller/auth.js");

const getRecordById = (recordId) => {
    logger.debug("Record " + recordId + " was requested");

    return recordModel.findById(recordId);
};

const apiGetOwnData = (req, res) => {
    recordModel.findById(req.recordId, 'username totalPoints streak level', {lean: true})
        .then(record => res.status(200).json(record));
};

const ensureRecordIsInGlobalLeaderboard = (username, res) => {
    createLeaderboardIfNotExistent("global", res);
    leaderboardModel.findOneAndUpdate({identifier: "global"}, {$addToSet: {entries: username}})
        .then((result) => {
            logger.info("result? " + result)
            leaderboardModel.save();
            res.status(200).send();
        }).catch(() => {
        res.status(400).send();
    });
}

const createRecordForUserIfNotExistent = (username, res) => {
    recordModel.exists({recordUsername: username}).then(existent => {
        if (existent) {
            logger.info("record for user " + username + " already existed:" + existent + ".")
            logger.info("making sure user is registered in global leaderboard");
            ensureRecordIsInGlobalLeaderboard(username, res);
        } else {
            recordModel.create({
                recordUsername: username,
                totalPoints: 0
            }).then(() => {
                ensureRecordIsInGlobalLeaderboard(username, res);
            }).catch(err => {
                logger.error(err);
                res.status(500).send();
            });
        }
    });
}


module.exports = {
    getRecordById,
    apiGetOwnData,
    createRecordForUserIfNotExistent
};
