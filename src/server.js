const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan-body');

const { SERVER_NAME } = require('./config');
const parityRoutes = require('./parity/parity.Router');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const versionController = require('./healthcheck');

const server = express();
server.name = SERVER_NAME;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use('/version', versionController);
server.use('/parity', parityRoutes);
server.use(errorHandler.afterAll);
morgan(server, {
    format: 'default',
    stream: {
        write(str) { logger.debug(`\n${str}`); },
    },
    noColors: true,
});

module.exports = server;
