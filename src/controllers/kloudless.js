"use strict";

const https = require('https');

const {checkForMissingVariablesInBodyElseSendResponseAndFalse} = require("./util");
const config = require('../config');

const logger = require('../logger')('controller/kloudless.js');

const apiDownloadFile = (req, res) => {
    if (!checkForMissingVariablesInBodyElseSendResponseAndFalse(req.params, ['account', 'file'], req, res)) {
        return;
    }

    logger.infoWithUuid(req, 'Kloudless download of file ' + req.params['file'] + ' from account ' +
        req.params['account'] + ' requested');

    const options = {
        host: 'api.kloudless.com',
        path: '/v1/accounts/' + req.params['account'] + '/storage/files/' + req.params['file'] + '/contents/',
        headers: {
            Authorization: 'APIKey ' + config.kloudlessApiKey
        }
    };

    https.get(options, function (response) {
        logger.debugWithUuid(req, "Kloudless download succeeded. Pushing to client");

        res.setHeader('content-type', 'text/csv');
        response.pipe(res);
    });
};

module.exports = {
    apiDownloadFile
};
