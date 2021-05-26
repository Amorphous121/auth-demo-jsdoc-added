const passport = require('passport');
const APIError = require('../utils/APIError');


/**
 * @module Authenitication
 */
/**
 * Handle jwt function varifies user with their token and roles.
 * @function handleJwt
 * @param {object} req - Request object 
 * @param {object} res - Response object.
 * @param {object} next - the next middlware function.
 * @param {(Array | string)} roles - the roles that are permitted to access the routes.
 * @returns {function}  It calls to the next middlware function.
 */

const handleJwt = (req, res, next, roles) => (err, user, info) => {
    try {
        if (err || !user) {
            throw new APIError({status : 401,  message : info.message});
        }
        if (roles !== undefined) {
            roles = typeof roles == 'string' ? [roles] : roles;
            if (!roles.includes(user.role))
                throw new APIError({status : 403, message : "You have not sufficient rights to access this route."});
        }
        req.user = user;
        return next();
    }
    catch(err) {
        next(err);
    }
}

/**
 * This function authenticates and checks the autorization level of user with given roles. 
 * @function hasAuth
 * @param {(Array | string)} roles 
 * @returns {function}  It call to next middlware function.
 */
exports.hasAuth = (roles) => (req, res, next) => {
    passport.authenticate('jwt', { session : false }, handleJwt(req, res, next, roles))(req, res, next);
}