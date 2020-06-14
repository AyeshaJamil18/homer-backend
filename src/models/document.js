"use strict";

const mongoose = require('mongoose');

// Defines a single history object for a column
// Memorizes what anonymization has been applied to a column
const DocumentColumnAnonymizationHistorySchema = new mongoose.Schema({
    type: String,
    options: String,
    createdOn: Date
});

// Define data in columns here, as we often do work on columns only
// Define a single column
const DocumentColumnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    anonymizationHistory: DocumentColumnAnonymizationHistorySchema,
    orderPosition: Number, // makes it possible to order columns
    data: [String]
});

// Define the complete document which contains columns
const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        // unique: true
    },
    originalFilename: {
        type: String
    },
    ownerId: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        required: true,
        default: true
    },
    data: [DocumentColumnSchema]
});

DocumentSchema.set('versionKey', false);
DocumentSchema.set('timestamps', true);

// Define indexes for faster access
// Subsequent createIndex calls (after first create) do not have impact on performance
// get document by userId will be a frequent call for
DocumentSchema.index({ownerId: 1});

// private=false will often be requested. Only memorize false to reduce space
DocumentSchema.index({private: 1},
    {partialFilterExpression: {private: false}});

const model = mongoose.model('Document', DocumentSchema);

// Define a method which only returns meta data about document without heavy data array
model.findByIdLight = (id) => model.findById(id, '-data');

module.exports = model;
