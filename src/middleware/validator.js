const Joi = require('joi');

module.exports = schema => (req, res, next) => {
    const result = Joi.validate(req, schema, {
        allowUnknown: true,
        abortEarly: false,
    });

    if (result.error) {
        const error = { httpStatusCode: 400, code: 'E_INVALID_ARGUMENTS' };
        error.fields = result.error.details
            .map(e => ({
                param: e.context.key,
                message: e.message,
                type: e.type === 'any.required' || e.type === 'any.empty'
                    ? 'REQUIRED' : 'INVALID',
            }));
        return res.status(400).json(error);
    }
    next();
};
