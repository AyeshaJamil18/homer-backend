"use strict";

const mongoose = require('mongoose');

// Define the exercise schema
const ExerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    videoId: {
        type: Number,
    },
    completed: {
        type: Boolean
    },
    date: {
        type: Date
    },
    feedback: {
        type: String
    }
});

ExerciseSchema.set('versionKey', false);
ExerciseSchema.set('timestamps', true);

module.exports = mongoose.model('Exercise', ExerciseSchema);
