"use strict";

const mongoose = require('mongoose');

// Define the record schema
const RecordSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    totalPoints: {
        type: Number,
    },
    streak: {
        type: Number
    },
    level: {
        type: Number
    }
});

RecordSchema.set('versionKey', false);
RecordSchema.set('timestamps', true);

module.exports = mongoose.model('Record', RecordSchema);
