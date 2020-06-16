"use strict";

const mongoose = require('mongoose');

// Define the video schema
const VideoSchema = new mongoose.Schema({
    videoId: {
        type: Number,
        required: true,
        unique: true
    },
    videoTitle: {
        type: String,
    },
    keywords: {
        type: [String]
    },
    duration: {
        type: Number
    },
    views: {
        type: Number
    }
});

VideoSchema.set('versionKey', false);
VideoSchema.set('timestamps', true);

module.exports = mongoose.model('Video', VideoSchema);
