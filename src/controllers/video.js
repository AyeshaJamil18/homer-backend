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

const GetVideoOfDay = (req, res) => {

    videoModel.count( {}, function(err, result){

        if(err){
            logger.debug("Total Elements in video are  " + err);
            res.status(401).send(err);
        }
        else{
            logger.debug("Total Elements in video are  " + result);
            videoModel.find({}, {_id:1}).then(data => {

                logger.debug("Data is " + data);
                const randomVal = between(1,result);
                logger.debug("Random id is " + randomVal);
                const Videoid =data[randomVal]._id;
                videoModel.find({_id: Videoid}).then(data => {
                     logger.debug("video " + data);
                     res.status(200).send(data);
                }).catch(
                );
            }).catch(error => {
                logger.debug(error);
                res.status(401).send(error);}
            );
           //
        }

    })



};
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


module.exports = {
    SaveVideo,
    GetVideoOfDay
};
