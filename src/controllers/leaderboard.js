"use strict";

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const leaderboardModel = require('../models/leaderboard');
const recordModel = require('../models/record');


const logger = require('../logger')("controller/auth.js");

const apiGetOwnData = (req, res) => {
    leaderboardModel.findById(req.leaderboardId, 'entries leader', {lean: true})
        .then(leaderboard => res.status(200).json(leaderboard));
};

const createLeaderboardIfNotExistent = (leaderboardIdentifier, res) => {
    leaderboardModel.exists({identifier : leaderboardIdentifier}).then(exists => {
        if (exists) {
            logger.info("leaderboard for " + leaderboardIdentifier + " already existed")
            res.status(200).send();
        } else {
            leaderboardModel.create({
                identifier: leaderboardIdentifier,
                entries: []
            }).then(() => {
                res.status(200).send();
            }).catch(err => {
                logger.error(err);
                res.status(500).send();
            });
        }
    });
};

const apiGenerateRanking = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['leaderboard'], req, res)) {
        return;
    }

    leaderboardModel.findOne({identifier: req.params['leaderboard']})
        .then(leaderboard => {
            logger.info("Found leaderboard: " + leaderboard.identifier + ": " + leaderboard + "\n"
                + ". Number of entries: " + leaderboard.entries.length + ". Entries: " + leaderboard.entries)
            const result = leaderboard.entries.map( function(entry) {
                // TODO retrieve points from recordModel and use real data
                let points = Math.floor(Math.random() * 100);
                let elem = { "username": entry, "points": points };
                return elem;
            });
            result.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
            res.status(200).send(result);
        }).catch(err => {
            logger.error(err);
            res.status(500).send(err);
        })

};

module.exports = {
    apiGetOwnData,
    createLeaderboardIfNotExistent,
    apiGenerateRanking
};
