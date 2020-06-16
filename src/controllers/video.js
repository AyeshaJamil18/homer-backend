"use strict";

const videoModel = require('../models/video');

const logger = require('../logger')("controller/auth.js");

const getVideoById = (videoId) => {
    logger.debug("Video " + videoId + " was requested");

    return videoModel.findById(videoId);
};

const apiGetOwnData = (req, res) => {
    videoModel.findById(req.videoId, 'username totalPoints streak level', {lean: true})
        .then(video => res.status(200).json(video));
};


module.exports = {
    getVideoById,
    apiGetOwnData
};
