"use strict";

const recordModel = require('../models/record');

const logger = require('../logger')("controller/auth.js");

const getRecordById = (recordId) => {
    logger.debug("Record " + recordId + " was requested");

    return recordModel.findById(recordId);
};

const apiGetOwnData = (req, res) => {
    recordModel.findById(req.recordId, 'username totalPoints streak level', {lean: true})
        .then(record => res.status(200).json(record));
};


module.exports = {
    getRecordById,
    apiGetOwnData
};
