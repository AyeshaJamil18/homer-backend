"use strict";

const leaderboardModel = require('../models/leaderboard');

const logger = require('../logger')("controller/auth.js");

const apiGetOwnData = (req, res) => {
    leaderboardModel.findById(req.leaderboardId, 'records leader', {lean: true})
        .then(leaderboard => res.status(200).json(leaderboard));
};


module.exports = {
    apiGetOwnData,
    createLeaderboardIfNotExistent
};
