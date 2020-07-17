"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const middleware = require('./middleware');
const logger = require('./logger')("rest_collecter");


const auth = require('./routes/auth');
const AdminAuth = require('./routes/AdminAuth');
const user = require('./routes/user');
const stats = require('./routes/stats');
const kloudless = require('./routes/kloudless');
const health = require('./routes/health');
const admin = require('./routes/admin');
const exercise = require('./routes/exercise');
const leaderboard = require('./routes/leaderboard');
const group = require('./routes/group');
const intervalReminder = require('./routes/intervalReminder');
const oneTimeReminder = require('./routes/oneTimeReminder');
const playlist = require('./routes/playlist');
const record = require('./routes/record');
const video = require('./routes/video');

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
        name: 'homer-Backend running!',
        documentation: "http://localhost:3000/api-docs"
    });
});

// API logger
api.use(logger.logRestCall);

// API routes
api.use('/auth', auth);
api.use('/AdminAuth', AdminAuth);
api.use('/user', user);
api.use('/stats', stats);
api.use('/kloudless', kloudless);
api.use('/health', health);
api.use('/admin', admin);
api.use('/exercise', exercise);
api.use('/leaderboard', leaderboard);
api.use('/group', group);
api.use('/intervalReminder', intervalReminder);
api.use('/oneTimeReminder', oneTimeReminder);
api.use('/playlist', playlist);
api.use('/record', record);
api.use('/video', video);

// finally, setup swagger
swaggerDoc(api);

module.exports = api;
