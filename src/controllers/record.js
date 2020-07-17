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

const createRecordForUserIfNotExistent = (username, res) => {
    recordModel.exists({recordUsername: username}).then(exists => {
        if (exists) {
            logger.info("record for user already existed")
            res.status(200).send();
        } else {
            recordModel.create({
                recordUsername: username,
                totalPoints: 0
            }).then(() => {
                logger.info("record for user created")
                // TODO loop through all leaderboards of the groups the user is member of
                createLeaderboardIfNotExistent("global", res);
                leaderboardModel.findOneAndUpdate({identifier: "global"}, {records: username})
                    .then(() => {
                        logger.info("record for user added to global leaderboard")
                        res.status(200).send();
                    }).catch(() => {
                    res.status(400).send();
                });
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
