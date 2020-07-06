"use strict";

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");

const adminModel = require('../models/admin');

const logger = require('../logger')("controller/AdminAuth.js");

const getAdminById = (adminId) => {
    logger.debug("Admin " + adminId + " was requested");

    return adminModel.findById(adminId);
};

const apiGetOwnData = (req, res) => {
    adminModel.findById(req.adminId, 'adminUsername email firstName lastName', {lean: true})
        .then(admin => res.status(200).json(admin));
};

const apiResolveIdToName = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['adminId'], req, res)) {
        return;
    }

    adminModel.findById(req.params['adminId'])
        .then(admin => admin ?
            res.status(200).send({adminUsername: admin.adminUsername}) : res.status(404).send("Not found"))
};

const apiCheckAdminEmail = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['adminEmail'], req, res)) {
        return;
    }

    adminModel.find({email: req.params['adminEmail']})
        .then(admin => (admin && admin.length > 0) ?
            admin[0].id === req.adminId ? res.status(200).send({email: admin[0].email, adminId: admin[0].id, isExist: true, isRequester:true})
                                    : res.status(200).send({email: admin[0].email, adminId: admin[0].id, isExist: true, isRequester:false})
            : res.status(404).send({email: null, adminId: null, isExist: false}))
};

module.exports = {
    getAdminById,
    apiResolveIdToName,
    apiGetOwnData,
    apiCheckAdminEmail
};
