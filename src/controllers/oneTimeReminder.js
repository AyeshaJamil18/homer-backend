"use strict";

const oneTimeReminderModel = require('../models/oneTimeReminder');

const logger = require('../logger')("controller/auth.js");

const getOneTimeReminderById = (oneTimeReminderId) => {
    logger.debug("OneTimeReminder " + oneTimeReminderId + " was requested");

    return oneTimeReminderModel.findById(oneTimeReminderId);
};

const apiGetOwnData = (req, res) => {
    oneTimeReminderModel.findById(req.oneTimeReminderId, 'reminderDate user', {lean: true})
        .then(oneTimeReminder => res.status(200).json(oneTimeReminder));
};


module.exports = {
    getOneTimeReminderById,
    apiGetOwnData
};
