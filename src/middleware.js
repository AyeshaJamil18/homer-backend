"use strict";

const jwt = require('jsonwebtoken');

const config = require('./config');

const logger = require('./logger')("middleware.js");

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.status(200).send();
    } else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {

    // check header or url parameters or post parameters for token
    let token = '';

    if (req.headers.authorization) {
        const auth = req.headers.authorization.split(' ');
        if (auth[0] === 'Bearer') {
            token = auth[1];

        } else {
            logger.debugWithUuid(req, 'Provided authorization header is not formatted as expected');
        }
    }

    if (!token) {
        const message = 'Could not parse token from authorization header';
        logger.debugWithUuid(req, message);

        return res.status(401).send({
            error: 'Unauthorized',
            message: message
        });
    }


    // verifies secret and checks exp
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            const message = 'Failed to authenticate with token. ' + err.name;
            logger.infoWithUuid(req, message);

            return res.status(401).send({
                error: 'Unauthorized',
                message: message
            });
        }

        logger.debugWithUuid(req, 'Authentication successful');

        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', {error: err})
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    errorHandler
};
