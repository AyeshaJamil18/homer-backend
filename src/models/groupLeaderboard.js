"use strict";

const mongoose = require('mongoose');

// Define the groupLeaderboard schema
const GroupLeaderboardSchema = new mongoose.Schema({
    groupTitle: {
        // title of the associated group
        type: String,
        required: true,
        unique: true
    },
    records: {
        // recordUsernames
        type: [String]
    },
    leader: {
        // username
        type: String
    }
});

GroupLeaderboardSchema.set('versionKey', false);
GroupLeaderboardSchema.set('timestamps', true);

module.exports = mongoose.model('GroupLeaderboard', GroupLeaderboardSchema);
