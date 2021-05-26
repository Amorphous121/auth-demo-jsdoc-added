const mongoose = require('mongoose');
const POST = require('./posts-model')
const APIError = require('../utils/APIError');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * @module comment-model
 */

/**
 * @typedef {object} CommentSchema - Schema of comment model.
 * @property {string} comment - The comment made by user. 
 * @property {string} user - The id of user of made this comment. 
 * @property {string} post - The id of post on which user made made this comment. 
 * @property {boolean} isDeleted - The boolean flag to indicate whether the comment is deleted or not. 
 * @property {string} deletedBy - The id of user who deleted this comment. 
 * @property {date} deletedAt - The timestamp when this comment is deleted. 
 */

const CommentSchema = new Schema({

    comment         : { type: String, required: true },
    user            : { type: ObjectId, ref: 'user', default: null },
    post            : { type: ObjectId, ref: 'post', default: null },
    isDeleted       : { type: Boolean, default: false, required: true },
    deletedBy       : { type: ObjectId, ref: 'user', default: null },
    deletedAt       : { type: Date, default: null }

}, { versionKey: false, timestamps: true });

/**
 * The pre hook to validate the post id.
 * @function 
 * 
 */
CommentSchema.pre('save', async function (next) {
    const post = await POST.findOne({ _id: this.post, isDeleted: false });
    if (post) next();
    else throw new APIError({status : 400, message : "Please provide a valid post id."});
})

module.exports = mongoose.model('comment', CommentSchema, 'comments');