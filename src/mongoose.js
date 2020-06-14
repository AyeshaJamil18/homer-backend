"use strict";

const config = require('./config');
const mongoose = require('mongoose');

module.exports = mongoose.connect(config.mongoURI,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});