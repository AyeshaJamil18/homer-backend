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
    invited: {
        // usernames of users, that are invited to the group, but haven't joined yet
        type: [String]
    }
});

GroupSchema.set('versionKey', false);
GroupSchema.set('timestamps', true);

module.exports = mongoose.model('Group', GroupSchema);
