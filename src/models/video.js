"use strict";

const mongoose = require('mongoose');

// Define the video schema
const VideoSchema = new mongoose.Schema({
    videoTitle: {
        type: String,
    },
    keywords: {
        type: String
    },
    videoUrl: {
        type: String
    },
    duration: {
        type: Number
    },
    views: {
        type: Number
    },
    uploader: {
        // adminUsername of the admin that uploaded the video
        type: String
    }
});

VideoSchema.set('versionKey', false);
VideoSchema.set('timestamps', true);

module.exports = mongoose.model('Video', VideoSchema);
