"use strict";

const mongoose = require('mongoose');

// Define the intervalReminder schema
const IntervalReminderSchema = new mongoose.Schema({
    intervalReminderName: {
        type: String,
        required: true,
        unique: true
    },
    cronExpression: {
        type: String
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

IntervalReminderSchema.set('versionKey', false);
IntervalReminderSchema.set('timestamps', true);

module.exports = mongoose.model('IntervalReminder', IntervalReminderSchema);
