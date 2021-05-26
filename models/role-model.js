const mongoose = require('mongoose');

/**
 * @model role-model
 */

/**
 * @typedef {object} RoleSchema - The Schema of role model.
 * @property {string} name - The name of the role. 
 *
 */

const RoleSchema = new mongoose.Schema({
    name : { type : String, required : true }
})

module.exports = mongoose.model('role', RoleSchema, 'roles');
