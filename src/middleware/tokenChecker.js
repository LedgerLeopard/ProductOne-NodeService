const jwt = require('../utils/jwt');
const {
    JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN,
} = require('../config');

async function checkToken(req, res, next) {
    try {
        const { token } = req.headers;
        const tokenValue = jwt.decode(token, JWT_SECRET_KEY);
        if (NODE_SERVICE_TOKEN !== tokenValue) {
            const message = 'Incorrect token';
            res.status(401).send({ message });
            res.end(); // eslint-disable-next-line consistent-return
            return;
        }

        return next();
    } catch (exception) {
        const { message } = exception;
        res.status(500).send({ message });
        return res.end();
    }
}

module.exports = checkToken;
