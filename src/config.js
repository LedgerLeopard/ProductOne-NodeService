require('dotenv').config({ path: `${__dirname}/.env` });
module.exports = {
    PORT: process.env.PORT,
    BLOCKCHAIN_PORT: process.env.BLOCKCHAIN_PORT,
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_PORT: process.env.BACKEND_PORT,
    SERVER_NAME: process.env.SERVER_NAME,
};