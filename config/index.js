/**
 * This module exports the configuration related to app.
 * @module config
 */


/**
 * The config exports
 * @typedef {object}
 * @property { string } dbUri - The connection string. 
 * @typedef {object} 
 * @property {string} jwt - The secret for signing and varifying the payload.
 * @typedef {object} 
 * @property {number} salt - the salt or round needed to hash user password
 */
module.exports = {
    dbUri : process.env.DB_URI,
    secretKeys : {
        jwt : process.env.TOKEN_SECRET
    },
    swageerOptions: {
        swaggerOptions: {
          defaultModelsExpandDepth: 0,
        },
    },
    bcryptSalt : {
        salt : process.env.SALT
    }
}