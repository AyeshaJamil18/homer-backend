"use strict";

const playlistModel = require('../models/playlist');

const logger = require('../logger')("controller/auth.js");

const getPlaylistById = (playlistId) => {
    logger.debug("Playlist " + playlistId + " was requested");

    return playlistModel.findById(playlistId);
};

const apiGetOwnData = (req, res) => {
    playlistModel.findById(req.playlistId, 'title videos subscribers', {lean: true})
        .then(playlist => res.status(200).json(playlist));
};


module.exports = {
    getPlaylistById,
    apiGetOwnData
};
