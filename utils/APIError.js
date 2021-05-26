


/**
 * 
 * The Extended Error class to customize errors.
 * @class 
 * @extends Error
 * @property {string} name - The name of the constructor.
 * @property {string} message - The error message.
 * @property {Array} errors - The list of errors.
 * @property {number} status - The status code for the error.
 * @property {boolean} isPublic - The boolean flag to indicate the public error.
 * @property {Array} stack - The Stack of errors.
 */
class ExtendableErrors extends Error {
    /**
     * @constructor
     * @param {object} error 
     */
    constructor({ message, errors, status, isPublic, stack }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.status = status;
        this.isPublic = isPublic;
        this.stack = stack;
    }
}

/**
 * @class APIError
 * @extends ExtendableErrors
 * 
 */
class APIError extends ExtendableErrors {
    /**
     * @constructor
     * @param {object} error 
     */
    constructor({ message, errors, stack, status = 500, isPublic = true}) {
        super({ message, errors, status, isPublic, stack })
    }
}

module.exports = APIError;