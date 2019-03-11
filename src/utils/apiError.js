const BaseError = require('./error');
const logger = require('./logger');

class APIError extends BaseError {
    constructor(httpStatusCode) {
        super();
        this.httpStatusCode = httpStatusCode;
        logger.error(`Error with httpCode: ${httpStatusCode}`);
        return this;
    }

    static internalServerError(message = 'Internal Server Error') {
        return new APIError(500)
            .setCode('E_INTERNAL_SERVER_ERROR')
            .setMessage(message);
    }

    static errorResponseHandler(error, res) {
        logger.error('errorResponseHandler: %s', error.message);
        if (error.stack) logger.error('error stack %s', error.stack);
        let result;
        if (!error.httpStatusCode) result = this.internalServerError(error.message);
        else result = error;
        res.status(result.httpStatusCode).send(result);
    }
}

module.exports = APIError;
