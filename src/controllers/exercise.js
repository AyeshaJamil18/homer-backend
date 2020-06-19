"use strict";

const exerciseModel = require('../models/exercise');

const logger = require('../logger')("controller/auth.js");

const getExerciseById = (exerciseId) => {
    logger.debug("Exercise " + exerciseId + " was requested");

    return exerciseModel.findById(exerciseId);
};

const apiGetOwnData = (req, res) => {
    exerciseModel.findById(req.exerciseId, 'username totalPoints streak level', {lean: true})
        .then(exercise => res.status(200).json(exercise));
};


module.exports = {
    getExerciseById,
    apiGetOwnData
};
