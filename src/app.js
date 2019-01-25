const http = require('http');
const app = require('./server');
const logger = require('./utils/logger');
const socketIo = require('socket.io-client');
const {
    PORT,
    BACKEND_URL,
    BACKEND_PORT_WITH_DOTS,
    SERVER_NAME
} = require('./config');
const subscriber = require('./transactions/subscriber');

const server = http.createServer(app);
const Web3 = require('web3');

server.listen(PORT, async () => {
    logger.info(`${SERVER_NAME} listening at ${PORT}`);
    const socket = socketIo(`${BACKEND_URL}${BACKEND_PORT_WITH_DOTS}`);
    logger.info(`Websockets are connected to backend ${BACKEND_URL}${BACKEND_PORT_WITH_DOTS}`);
    subscriber.emitTransactions(socket);
    subscriber.emitBlocks(socket);
});