"use strict";

const mongoose = require('mongoose');

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date
    },
    registrationDate: {
        type: Date
    },
    friends: {
        // usernames of friends
        type: [String]
    },
    playlists: {
        //playlists the user subscribed to
        type: [String]
    }
});

UserSchema.set('versionKey', false);
UserSchema.set('timestamps', true);

module.exports = mongoose.model('User', UserSchema);
