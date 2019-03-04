require('dotenv').config({ path: `${__dirname}/.env` });
module.exports = {
    PORT: process.env.PORT,
    BLOCKCHAIN_PORT: process.env.BLOCKCHAIN_PORT,
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_PORT: process.env.BACKEND_PORT,
    SERVER_NAME: process.env.SERVER_NAME,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN: process.env.NODE_SERVICE_TOKEN,
    UPDATE_PARITY_SCRIPT: `${__dirname}/static/scripts/update_parity.sh`,
};