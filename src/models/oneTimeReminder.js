"use strict";

const mongoose = require('mongoose');

// Define the oneTimeReminder schema
const OneTimeReminderSchema = new mongoose.Schema({
    oneTimeReminderName: {
        type: String,
        required: true,
        unique: true
    },
    reminderDate: {
        type: Date
    },
    user: {
        // username of the user to be reminded
        type: String
    },
    playlist: {
        // title
        type: String
    },
    video: {
        // title
        type: String
    }
});

OneTimeReminderSchema.set('versionKey', false);
OneTimeReminderSchema.set('timestamps', true);

module.exports = mongoose.model('OneTimeReminder', OneTimeReminderSchema);
