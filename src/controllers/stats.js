"use strict";

const userModel = require('../models/user');
const documentModel = require('../models/document');

const filteredDocumentCount = (filter) => {
    return documentModel.countDocuments(filter);
};

const apiGetTotalDocumentCount = (req, res) => {
    filteredDocumentCount({}).then(count => respondWithCount(res, count));
};

const apiGetTotalPublicDocumentCount = (req, res) => {
    filteredDocumentCount({private: false}).then(count => respondWithCount(res, count));
};

const apiGetTotalUserCount = (req, res) => { // could also use estimatedDocumentCount()
    userModel.countDocuments().then(count => respondWithCount(res, count));
};

const respondWithCount = (res, count) => {
    return res.status(200).send({count: count});
};

module.exports = {
    apiGetTotalDocumentCount,
    apiGetTotalPublicDocumentCount,
    apiGetTotalUserCount
};
