const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * @module user-model
 */


/**
 * 
 * @typedef {object} UserSchema - The schema of the usermodel.
 * @property {string} name - The name of the user.4
 * @property {string} username - The unique username of the user.
 * @property {boolean} isDeleted - The boolean flag to indicate the user existance.
 * @property {string} password - The password of the user.
 * @property {Array} posts - The list of posts id's created by user.
 * @property {Array} comments - The list of user comments 
 * @property {string} role - The id of the role a user has.
 * @property {string} deletedBy - The id of the user who deleted this.
 * @property {date} deletedAt - The timestamp when the user is deleted. 
 */

const UserSchema =  new Schema({

    name            : { type  : String, required : true },
    username        : { type  : String, required : true, unique : true },
    isDeleted       : { type  : Boolean, default : false, required : true },
    password        : { type  : String, required : true, },
    posts           : [{ type : ObjectId, ref : 'post', default: null }],
    comments        : [{ type : ObjectId, ref : 'comment', default: null }],
    role            : { type  : ObjectId, ref : 'role',  default: null },
    deletedBy       : { type  : ObjectId, ref: 'user', default: null},
    deletedAt       : { type  : Date, default: null },

}, { versionKey: false, timestamps : true });


/**
 * @function isValidPassword
 * @param {string} password - Password of the user.
 * @returns {boolean}  The result of password comparision.
 */
UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

/**
 * Hashesh the user password.
 * @function 
 */
UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

/**
 * This methods hashes the password if it's updated.
 * @function
 */

UserSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10);
        next();
    }
})


module.exports = mongoose.model('user', UserSchema, 'users');