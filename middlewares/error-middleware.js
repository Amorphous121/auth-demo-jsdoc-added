    const { ValidationError } = require('express-validation');
    const APIError = require('../utils/APIError');


    /**
     * This module exports the error handling middlewares.
     * @module error
     */
    /**
     * This function extracts the error messages from validation errors.
     * @function getErrorMessage
     * @param {object} error - The validation error object 
     * @returns {string}  The error message.
     */
    const getErrorMessage = error => {
        error = error.details;
        if (error.params)   return error.params[0].message;
        if (error.body)     return error.body[0].message;
        if (error.query)    return error.query[0].message;
    };


    /**
     * This function handles the error thrown by controller.
     * @function handler 
     * @param {object} err - Error object.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @param {function} next - next middleware function. 
     * @returns {object} Returns error as a response.
     */
    exports.handler = (err, req, res, next) => {
        let message = err.message || "Something went wrong. Please try again later.";
        if (!err.isPublic) {
            err.status = 500;
            message = "Something went wrong. Please try again later.";
        }
        if (process.env.NODE_ENV === 'development') {
            if (err.stack)  console.log(err.stack);
            if (err.errors) console.log(err.errors);
        }
        return res.sendJson(err.status, message);
    };

    /**
     * This function converts the error into APIError.
     * @function converter
     * @param {object} err - Error object.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @param {function} next - next middlware function 
     * @returns {object}  Returns error as response.
     */
    exports.converter = (err, req, res, next) => {

        let convertedErr = err;
        if (err instanceof ValidationError)
            convertedErr = new APIError({ status : 422, message : getErrorMessage(err)});
        else if (!(err instanceof APIError))
            convertedErr = new APIError({ status : err.status, message : err.message, stack : err.stack });
        return this.handler(convertedErr, req, res);
    };


    /**
     * This functions handles the misleading routes and sends an error message as not found.
     * @function notFound
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @param {function} next - next middlware function 
     * @returns {object}  Returns not found error as response.
     */
    exports.notFound = (req, res, next) => {
        const err = new APIError({ message: 'Page not found', status: 404});
        return this.handler(err, req, res);
    };  