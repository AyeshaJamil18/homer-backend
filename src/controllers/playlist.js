"use strict";

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const playlistModel = require('../models/playlist');
const userModel = require('../models/user');

const logger = require('../logger')("controller/auth.js");

const apiGetOwnData = (req, res) => {
    playlistModel.findById(req.playlistId, 'title videos subscribers', {lean: true})
        .then(playlist => res.status(200).json(playlist));
};

const getPlaylist = (req, res) => {

    logger.debug("Requested document with id " + req.userId);
    userModel.findById(req.userId).then(currentUser => {

        playlistModel.find({creator: currentUser['username']}).then(data => {

            let extractedDouments = data.map(doc => {
                return {...extractParamsFromDocument(doc, ['title', '_id', 'videos', 'subscribers', 'creator'])}
            });
            Promise.all(extractedDouments).then(finalDocs => res.status(200).json({docs: finalDocs.filter(doc => doc)}));
        }).catch(error => {
                logger.debug(error);
            }
        );

    }).catch(err => {
        logger.error(err);
        res.status(500).send("User Not Found")
    })
};

const extractParamsFromDocument = (doc, variables) => {
    let temp = {};
    variables.forEach(variable => temp[variable] = doc[variable]);
    return temp;
};


const addVideoToPlaylist = (req, res) => {

    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.body, ['PlaylistName', 'VideoId'], req, res)) {
        return;
    }
    playlistModel.findById(req.body.PlaylistName).then(() => {

        playlistModel.findByIdAndUpdate(req.body.PlaylistName, {$addToSet: {videos: req.body.VideoId}})
            .then(() => {
                logger.info("Successfully added video " + req.body['Video_id'] + "to playlist " + req.body['PlaylistName']);
                res.status(200).send();
            })
            .catch(err => {
                logger.error(err);
                res.status(500).send("Video could not be added.");
            })
    }).catch(err => {
        logger.error(err);
        res.status(500).send("Something went wrong.")
    })
};


module.exports = {
    getPlaylist,
    addVideoToPlaylist,
    apiGetOwnData
};
