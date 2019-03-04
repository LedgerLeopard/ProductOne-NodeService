const express = require('express');
const bodyParser = require('body-parser');
const { SERVER_NAME } = require('./config');
const parityRoutes = require('./parity/parity.Router');

const server = express();
server.name = SERVER_NAME;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use('/parity', parityRoutes);

module.exports = server;
