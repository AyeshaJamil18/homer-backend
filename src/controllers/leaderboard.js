"use strict";

const leaderboardModel = require('../models/leaderboard');

const logger = require('../logger')("controller/auth.js");

const apiGetOwnData = (req, res) => {
    leaderboardModel.findById(req.leaderboardId, 'records leader', {lean: true})
        .then(leaderboard => res.status(200).json(leaderboard));
};

const createLeaderboardIfNotExistent = (leaderboardIdentifier, res) => {
    leaderboardModel.exists({identifier : leaderboardIdentifier}).then(exists => {
        if (exists) {
            logger.info("leaderboard for " + leaderboardIdentifier + " already existed")
            res.status(200).send();
        } else {
            leaderboardModel.create({
                identifier: leaderboardIdentifier
            }).then(() => {
                res.status(200).send();
            }).catch(err => {
                logger.error(err);
                res.status(500).send();
            });
        }
    });
}

module.exports = {
    apiGetOwnData,
    createLeaderboardIfNotExistent
};
