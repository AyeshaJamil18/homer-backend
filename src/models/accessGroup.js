"use strict";

const mongoose = require('mongoose');

const modifierEnum = Object.freeze({READ: 'r', WRITE: 'w'});

// Defines access for a single document
// Only defines read (r) or write (w)
// Write includes read
const AccessGroup = new mongoose.Schema({
    documentId: {
        type: String
    },
    modifier: {
        type: String,
        enum: Object.values(modifierEnum),
        required: true
    },
    userIds: {
        type: [String]
    }
});

AccessGroup.set('versionKey', false);
AccessGroup.set('timestamps', true);

// Define indexes for faster access
// This tuple can only occur once and will be requested very often
AccessGroup.index({documentId: 1, modifier: 1}, {unique: true});

const model = mongoose.model('AccessGroup', AccessGroup);

// Export modifierEnum so it is accessible from outside
model.modifierEnum = modifierEnum;

module.exports = model;
