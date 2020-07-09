"use strict";


const videoModel = require('../models/video');

const logger = require('../logger')("controller/video.js");
const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");


const SaveVideo = (req, res) => {
    const Video = Object.assign(req.body);

    videoModel.create(Video)
        .then(dbUser => {
            logger.debugWithUuid(req, "Video  " + dbUser.videoTitle+ " has been stored");
            res.status(200).json(dbUser)
        })
        .catch(error => {

                logger.errorWithUuid(req, error.message);

                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                })

        });
};

module.exports = {
    SaveVideo
};
