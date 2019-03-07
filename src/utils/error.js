const logger = require('./logger');

class ErrorBuilder extends Error {
    constructor() {
        super();
        this.code = '';
        this.message = '';
        this.params = null;
        return this;
    }

    setCode(code) {
        this.code = code;
        logger.error(`Error with code: ${code}`);
        return this;
    }

    setMessage(message) {
        this.message = message;
        logger.error(`Error with message: ${this.message}`);
        return this;
    }

    build() {
        const newVar = {};
        newVar.code = this.code;
        newVar.message = this.message;

        if (this.params != null) newVar.params = this.params;

        return newVar;
    }
}

module.exports = ErrorBuilder;
