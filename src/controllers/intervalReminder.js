"use strict";

const intervalReminderModel = require('../models/intervalReminder');

const logger = require('../logger')("controller/auth.js");

const getIntervalReminderById = (intervalReminderId) => {
    logger.debug("IntervalReminder " + intervalReminderId + " was requested");

    return intervalReminderModel.findById(intervalReminderId);
};

const apiGetOwnData = (req, res) => {
    intervalReminderModel.findById(req.intervalReminderId, 'cronExpression user', {lean: true})
        .then(intervalReminder => res.status(200).json(intervalReminder));
};


module.exports = {
    getIntervalReminderById,
    apiGetOwnData
};
