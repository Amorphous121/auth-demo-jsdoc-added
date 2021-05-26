/**
 * This module Converts the response to be send into a Standard object.
 * @module generate-response.
 */

/**
 * This function converts the response into standard response object.
 * @function sendJson
 * @param {number} statusCode - The stauts code to be send.
 * @param {(object | string)} response - The response to be send. 
 * @returns {object}  The standard response.
 */
exports.sendJson = function sendJson(statusCode = 200, response) {
    var status = (statusCode >= 200 && statusCode < 300) ? true : false;
    
    if (!(typeof response == "object" && response.message && response.data))
        response = (typeof response == "string") ? { status, message : response } : { status , data : response };
    
    return this.status(statusCode).json(response); 
}   