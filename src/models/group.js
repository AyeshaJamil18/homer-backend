"use strict";

const mongoose = require('mongoose');

// Define the group schema
const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        // usernames of the users that are members of the group
        type: [String]
    },
    groupLeaderboard: {
        // name of the groupLeaderboard of the group
        type: String
    }
});

GroupSchema.set('versionKey', false);
GroupSchema.set('timestamps', true);

module.exports = mongoose.model('Group', GroupSchema);
