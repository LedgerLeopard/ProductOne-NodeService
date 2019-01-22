const jwt = require('jsonwebtoken');

function generateToken(token, secret) {
    return jwt.sign(
        {
            token
        },
        secret,
        {
            noTimestamp: true,
        }
    );
}

module.exports = generateToken;
