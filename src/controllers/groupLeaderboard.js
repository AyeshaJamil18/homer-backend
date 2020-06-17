"use strict";

const groupLeaderboardModel = require('../models/groupLeaderboard');

const logger = require('../logger')("controller/auth.js");

const getGroupLeaderboardById = (groupLeaderboardId) => {
    logger.debug("GroupLeaderboard " + groupLeaderboardId + " was requested");

    return groupLeaderboardModel.findById(groupLeaderboardId);
};

const apiGetOwnData = (req, res) => {
    groupLeaderboardModel.findById(req.groupLeaderboardId, 'groupTitle records leader', {lean: true})
        .then(groupLeaderboard => res.status(200).json(groupLeaderboard));
};


module.exports = {
    getGroupLeaderboardById,
    apiGetOwnData
};
