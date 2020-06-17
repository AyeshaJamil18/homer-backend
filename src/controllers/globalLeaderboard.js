"use strict";

const globalLeaderboardModel = require('../models/globalLeaderboard');

const logger = require('../logger')("controller/auth.js");

const apiGetOwnData = (req, res) => {
    globalLeaderboardModel.findById(req.globalLeaderboardId, 'records leader', {lean: true})
        .then(globalLeaderboard => res.status(200).json(globalLeaderboard));
};


module.exports = {
    apiGetOwnData
};
