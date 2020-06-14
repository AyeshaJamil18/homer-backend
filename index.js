"use strict";

const http = require('http');
//const mongoose   = require('mongoose');

const mongoose = require('./src/mongoose');

const api = require('./src/api');
const config = require('./src/config');

// First of all, connect to DB as this takes a little time
mongoose.catch(err => {
    console.log('Error connecting to the database', err.message);
    process.exit(err.statusCode);
});

// Set the port to the API.
api.set('port', config.port);

//Create a http server based on Express
const server = http.createServer(api);

// Configure listen events
server.on('listening', () => {
    console.log(`API is running in port ${config.port}`);

    server.emit('test-hook');
});

server.on('error', (err) => {
    console.log('Error in the server', err.message);
    process.exit(err.statusCode);
});

server.listen(config.port);

//Connect to the MongoDB database; then start the server and export the object so tests can use it
module.exports = server;
