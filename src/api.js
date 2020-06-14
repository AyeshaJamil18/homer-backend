"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const middleware = require('./middleware');
const logger = require('./logger')("rest_collecter");


const auth = require('./routes/auth');
const document = require('./routes/document');
const accessGroup = require('./routes/accessGroup');
const user = require('./routes/user');
const stats = require('./routes/stats');
const kloudless = require('./routes/kloudless');
const health = require('./routes/health');

const swaggerDoc = require('./swaggerDoc');

const api = express();


// Adding Basic Middleware
api.use(helmet());
api.use(bodyParser.json({limit: '10mb'}));
api.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
api.use(middleware.allowCrossDomain);


// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'dedas-Backend running!',
        documentation: "http://localhost:3000/api-docs"
    });
});

// API logger
api.use(logger.logRestCall);

// API routes
api.use('/auth', auth);
api.use('/document', document);
api.use('/accessgroup', accessGroup);
api.use('/user', user);
api.use('/stats', stats);
api.use('/kloudless', kloudless);
api.use('/health', health);

// finally, setup swagger
swaggerDoc(api);

module.exports = api;
