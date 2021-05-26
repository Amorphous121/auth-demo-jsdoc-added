const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * @module post-model
 */

/**
 * @typedef {object} PostSchema - The Schema of Post Model.
 * @property {string} title - The title of post.
 * @property {string} content - The content of the post.
 * @property {boolean} isDeleted - The boolean flag indecating the post has been deleted or not.
 * @property {string} user -  The id of the user who created this post.
 * @property {Array} comments - The list of ids made on this post.
 * @property {string} deletedBy - The id of the user who deleted this post.
 * @property {date} deletedAt - The timestamp when the user deleted this post.
 */
const PostSchema = new Schema({
    title           : { type: String, required: true },
    content         : { type: String, required: true },
    isDeleted       : { type: Boolean, default: false },
    user            : { type: ObjectId, ref: 'user', default: null },
    comments        : [{ type: ObjectId, ref: 'comment', default: null }],
    deletedBy       : { type: ObjectId, ref: 'user', default: null },
    deletedAt       : { type: Date, default: null },

}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('post', PostSchema, 'posts');