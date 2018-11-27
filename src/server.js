const express = require('express');
const { SERVER_NAME } = require('./config');

const server = express();
server.name = SERVER_NAME;

module.exports = server;
