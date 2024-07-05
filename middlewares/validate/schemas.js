const Joi = require('joi');

const schemas = {
    register: Joi.object().keys({
        username: Joi.string().alphanum().min(3).required(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(4).alphanum().required(),
        //confirmPassword: Joi.ref('password')
        // Any other fields you want to validate
    })
};

module.exports = schemas