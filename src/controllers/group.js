"use strict";

const groupModel = require('../models/group');

const logger = require('../logger')("controller/auth.js");

const getGroupById = (groupId) => {
    logger.debug("Group " + groupId + " was requested");

    return groupModel.findById(groupId);
};

const apiGetOwnData = (req, res) => {
    groupModel.findById(req.groupId, 'title members', {lean: true})
        .then(group => res.status(200).json(group));
};


module.exports = {
    getGroupById,
    apiGetOwnData
};
