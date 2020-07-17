"use strict";

const mongoose = require('mongoose');

// Define the Leaderboard schema
const LeaderboardSchema = new mongoose.Schema({
    // 'global' or the name of the group
    identifier : {
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

LeaderboardSchema.set('versionKey', false);
LeaderboardSchema.set('timestamps', true);

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
