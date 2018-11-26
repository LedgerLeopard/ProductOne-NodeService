const express = require('express');

const server = express();
server.name = process.env.SERVER_NAME;

module.exports = server;
