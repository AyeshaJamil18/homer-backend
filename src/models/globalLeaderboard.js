"use strict";

const mongoose = require('mongoose');

// Define the globalLeaderboard schema
const GroupLeaderboardSchema = new mongoose.Schema({
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
