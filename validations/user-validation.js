const Joi       = require('Joi');
Joi.objectId    = require('joi-objectid')(Joi);
const USER      = require('../models/users-model');
const APIError  = require('../utils/APIError');

exports.register = {
    body : Joi.object({
        name        : Joi.string().min(3).max(20).trim().required(),
        username    : Joi.string().min(3).max(15).trim().required().lowercase(),
        password    : Joi.string().min(4).max(10).trim().required() 
    })
}

exports.login = {
    body : Joi.object({
        username    : Joi.string().min(3).max(15).trim().required().lowercase(),
        password    : Joi.string().min(4).max(10).trim().required() 
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.objectId().required(),
    }),
    body : Joi.object({
        name        : Joi.string().min(3).max(20).trim(),
        username    : Joi.string().min(3).max(15).trim().lowercase(),
        password    : Joi.string().min(4).max(10).trim(), 
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}

exports.findOne = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}


/**
 * Function to validate the user id and check the existance.
 * @function isExists 
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {object} next - next middlware function.
 */
exports.isExists = async (req, res, next) => {
    const _id = req.params.id;
    const user = await USER.findOne({_id, isDeleted : false});
    if  (!user) throw new APIError({status : 404, message : "No such user found with given id. " });
    next();
}