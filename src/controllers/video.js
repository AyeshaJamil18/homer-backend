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


    videoModel.find({keywords: req.params['tag']}).then(data => {

        // logger.debug("video " + data.videoTitle);
        // res.status(200).send({videoTitle: data[0].videoTitle, videoUrl: data[].videoUrl});
        let extractedDouments = data.map(doc =>
        {
            return {...extractParamsFromDocument(doc, ['videoTitle', 'videoUrl'])}
    });
        Promise.all(extractedDouments).then(finalDocs => res.status(200).json({docs: finalDocs.filter(doc => doc)}));
    }).catch(error => {
        logger.debug(error);}
    );

};

const extractParamsFromDocument = (doc, variables) => {
    let temp = {};
    variables.forEach(variable => temp[variable] = doc[variable]);
    return temp;
};



module.exports = {
    SaveVideo,
    GetVideoByTag

};
