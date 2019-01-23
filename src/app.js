const http = require('http');
const app = require('./server');
const logger = require('./utils/logger');
const socketIo = require('socket.io-client');
const {
    PORT,
    BACKEND_URL,
    BACKEND_PORT,
    SERVER_NAME
} = require('./config');
const subscriber = require('./transactions/subscriber');

const server = http.createServer(app);

server.listen(PORT, async () => {
    logger.info(`${SERVER_NAME} listening at ${PORT}`);
    const socket = socketIo(`${BACKEND_URL}:${BACKEND_PORT}`);
    subscriber.emitTransactions(socket);
    subscriber.emitBlocks(socket);
});