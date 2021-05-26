const mongoose = require('mongoose');
const { dbUri } = require('../config');

/**
 * This module exports the database connection.
 * @module Database
 */

/**
 * The database configuration options.
 * @typedef {object} 
 * @property {boolean} useNewUrlParser - The parsing option.
 * @property {boolean} useUnifiedTopology - The topology option.
 * @property {boolean} useCreateIndex - The index property.
 * @property {boolean} useFindAndModify - The option for using native methods.
 * @property {boolean} autoIndex - The option for auto indexing.
 */
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
};

/**
 * The Database connection function.
 * @function connect
 */
const connect = async () => {
    mongoose.connect(dbUri, options)
        .then(() => { 
            if (process.env.NODE_ENV == 'development')
                console.log("**************** Database Connected Succesfully ****************** ")})
        .catch((err) => {
            console.log(err.message);
            throw new Error("Problem while connecting database");
        })
}

module.exports = {
    connect,
}
