"use strict";

const mongoose = require('mongoose');

// Define the playlist schema
const PlaylistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    videos: {
        // IDs of the videos the playlist consists of
        type: [Number],
    },
    subscribers: {
        // usernames of the users that subscribed to the playlist
        type: [String]
    },
    creator: {
        // username of the user that created the playlist
        type: String
    }
});

PlaylistSchema.set('versionKey', false);
PlaylistSchema.set('timestamps', true);

module.exports = mongoose.model('Playlist', PlaylistSchema);
