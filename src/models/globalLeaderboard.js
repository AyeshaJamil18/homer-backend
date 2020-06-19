"use strict";

const mongoose = require('mongoose');

// Define the globalLeaderboard schema
const GlobalLeaderboardSchema = new mongoose.Schema({
    records: {
        // recordUsernames
        type: [String]
    },
    leader: {
        // username
        type: String
    }
});

GlobalLeaderboardSchema.set('versionKey', false);
GlobalLeaderboardSchema.set('timestamps', true);

module.exports = mongoose.model('GlobalLeaderboard', GlobalLeaderboardSchema);
