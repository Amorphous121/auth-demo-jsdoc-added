const jwt = require('jsonwebtoken');

const { secretKeys } = require('../config')

/**
 * @function generateJwt
 * @param {object} obj - The payload to be signed. 
 * @returns {string} The signed payload.
 */

exports.generateJwt = obj => jwt.sign(obj, secretKeys.jwt);


/**
 * @function toObject
 * @param {object} json - The json need to be convert into object. 
 * @returns {object}  The Javascript object.
 */

exports.toObject = json => JSON.parse(JSON.stringify(json));


/**
 * Function to capitalize first letter of 
 * @function capitalize
 * @param {string} str - the string to be uppercased. 
 * @returns {string}  The uppercased first letter string.
 */
exports.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Function to remove unneccessary fields.
 * @function removeFields
 * @param {object} obj - The object from which fields need to be removed.
 * @param {(Array | string)} keys - The fields which needs to be removed. 
 * @param {boolean} defaultFields  - The flag to indicate the default fields should be kept or not.
 * @returns {object} The object with sanitization.
 */
exports.removeFields = (obj, keys, defaultFields = true) => {
    var basicFields = ['deletedAt', 'createdAt', 'updatedAt', 'deletedBy', 'isDeleted'];
    keys = typeof keys == 'string' ? [keys] : keys || [];
    if (defaultFields) keys = keys.concat(basicFields);
    keys.forEach(key => delete obj[key]);
    return obj;
}