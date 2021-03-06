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

function decode(jwtString, secretKey) {
    try {
        jwt.verify(jwtString, secretKey);
        return jwt.decode(jwtString, secretKey).token;
    } catch (e) {
        return undefined;
    }
}

module.exports = {
    generateToken,
    decode,
};
