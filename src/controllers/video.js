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



const GetVideoByTag = (req, res) => {

    logger.debug("Requested document with id " + req.params['tag']);


    videoModel.findOne({keywords: req.params['tag']}).then(data => {
        logger.debug("video " + data.videoTitle);
        res.status(200).send({videoTitle: data.videoTitle, videoUrl: data.videoUrl});
    }).catch(error => {
        logger.debug(error);}
    );

};



module.exports = {
    SaveVideo,
    GetVideoByTag

};
