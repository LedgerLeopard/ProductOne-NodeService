const Joi = require('joi');

const updateVersion = {
    body: {
        newVersion: Joi.string().required(),
    },
};

module.exports = {
    updateVersion,
};
