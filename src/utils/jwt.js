const jwt = require('jsonwebtoken');
const {
    JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN,
} = require('../config');

function generateToken() {
    return jwt.sign(
        {
            token: NODE_SERVICE_TOKEN
        },
        JWT_SECRET_KEY,
        {
            noTimestamp: true,
        }
    );
}

module.exports = generateToken();
