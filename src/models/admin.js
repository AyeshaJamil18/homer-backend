"use strict";

const mongoose = require('mongoose');

// Define the admin schema
const AdminSchema = new mongoose.Schema({
    adminUsername: {
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
    uploads: {
        // IDs of the uploaded videos
        type: [Number]
    }
});

AdminSchema.set('versionKey', false);
AdminSchema.set('timestamps', true);

module.exports = mongoose.model('Admin', AdminSchema);
