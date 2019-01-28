require('dotenv').config({ path: `${__dirname}/.env` });
const BACKEND_PORT = process.env.BACKEND_PORT;

module.exports = {
    PORT: process.env.PORT || 8081,
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost',
    BACKEND_PORT_WITH_DOTS: BACKEND_PORT ? `:${BACKEND_PORT}` : '',
    SERVER_NAME: process.env.SERVER_NAME || 'NodeService',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN: process.env.NODE_SERVICE_TOKEN,
};