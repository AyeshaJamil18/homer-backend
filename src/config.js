"use strict";
const env = require('./environment');

const config = require(__dirname + '/../config.json')[env.getEnv()];

module.exports = config;