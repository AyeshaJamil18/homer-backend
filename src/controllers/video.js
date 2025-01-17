"use strict";


const videoModel = require('../models/video');

const logger = require('../logger')("controller/video.js");


const saveVideo = (req, res) => {
    const video = Object.assign(req.body);

    videoModel.create(video)
        .then(dbUser => {
            logger.debugWithUuid(req, "Video  " + dbUser.videoTitle + " has been stored");
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


const getVideoOfDay = (req, res) => {

    videoModel.count({}, function (err, result) {
        if (err) {
            logger.debug("Total Elements in video are  " + err);
            res.status(401).send(err);
        } else {
            logger.debug("Total Elements in video are  " + result);
            videoModel.find({}, {_id: 1}).then(data => {

                logger.debug("Data is " + data);
                const randomVal = between(1, result);
                logger.debug("Random id is " + randomVal);
                const Videoid = data[randomVal]._id;
                videoModel.find({_id: Videoid}).then(data => {
                    logger.debug("video " + data);
                    res.status(200).send(data[0]);
                }).catch(
                );
            }).catch(error => {
                    logger.debug(error);
                    res.status(401).send(error);
                }
            );
        }
    })


};

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


const getVideoByTag = (req, res) => {

    logger.debug("Requested document with id " + req.params['tag']);

    videoModel.find({keywords: req.params['tag']}).then(data => {
        
        let extractedDouments = data.map(doc => {
            return {...extractParamsFromDocument(doc, ['videoTitle', 'videoUrl'])}
        });
        Promise.all(extractedDouments).then(finalDocs => res.status(200).json({docs: finalDocs.filter(doc => doc)}));
    }).catch(error => {
            logger.debug(error);
        }
    );

};

const extractParamsFromDocument = (doc, variables) => {
    let temp = {};
    variables.forEach(variable => temp[variable] = doc[variable]);
    return temp;
};


module.exports = {
    saveVideo,
    getVideoOfDay,
    getVideoByTag
};
