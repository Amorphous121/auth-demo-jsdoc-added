const USER = require('../models/users-model');
const COMMENT = require('../models/comments-model');
const POST = require('../models/posts-model');
const APIError = require('../utils/APIError');
const {removeFields, toObject} = require('../utils/helper');

/**
 * This module contains all the comment route controller functions
 * @module comment-controller 
 */

/**
 * This function find all the comments and sends as a response.
 * @function findAll
 * @param {object} req - Request object
 * @param {object} res  - Response object
 * @param {function} next - next middlware function
 * @returns {object} list of  comments as a response.
 */
exports.findAll = async (req, res, next) => {

    const comments = await COMMENT.find({ isDeleted: false }, '_id comment user post')
        .populate({ path: 'user', match: { isDeleted: false }, select: { name: 1, username: 1 } })
        .populate({ path: 'post', match: { isDeleted: false }, select: { title: 1, content: 1 } });

    if (comments) return res.sendJson(200, comments)
    else throw new APIError({ message: "No comments availdable" });
}

/**
 * 
 * This function find the comments of given id and sends as a response.
 * @function findOne
 * @param {object} req - Request object
 * @param {object} res  - Response object
 * @param {function} next - next middlware function
 * @returns {object} found comments's object a response.
 */
exports.findOne = async (req, res, next) => {

    const comments = await COMMENT.findOne({ _id: req.params.id, isDeleted: false }, '_id comment user post')
        .populate({ path: 'user', match: { isDeleted: false }, select: { name: 1, username: 1 } })
        .populate({ path: 'post', match: { isDeleted: false }, select: { title: 1, content: 1 } })

    if (comments) return res.sendJson(200, comments)
    else throw new APIError({ status: 404, message: "No Such Comment Exists" });
}


/**
 * 
 * This function creates comment on given post sends as a response.
 * @function create
 * @param {object} req - Request object
 * @param {object} res  - Response object
 * @param {function} next - next middlware function
 * @returns {object} newly created comment object as a response
 */
exports.create = async (req, res, next) => {
    let payload = req.body;
    let comment = await COMMENT.create({
        post: payload.post,
        comment: payload.comment,
        user: req.user._id,
    });
    await USER.findOneAndUpdate({ _id: req.user._id, isDeleted: false }, { $addToSet: { comments: comment._id } });
    await POST.findOneAndUpdate({ _id: payload.post, isDeleted: false }, { $addToSet: { comments: comment._id } });
    return res.sendJson(200, removeFields(toObject(comment)));
}


/**
 * 
 * This function find the cpmment of given id updates it and sends as a response.
 * @function update
 * @param {object} req - Request object
 * @param {object} res  - Response object
 * @param {function} next - next middlware function
 * @returns {object} updated comment's object as a response
 */
exports.update = async (req, res, next) => {

    let commentInfo = await COMMENT.findOne({ _id: req.params.id, isDeleted: false });

    if (commentInfo.user == req.user._id) {
        let comment = await COMMENT.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { ...req.body, user: req.user._id }, { new: true });
        res.sendJson(200, removeFields(toObject(comment)));
    } else throw new APIError({ status: 401, message: "You can't update someone else's comment" });

}

/**
 * 
 * This function find the comment of given id, deletes it and sends a response.
 * @function delete
 * @param {object} req - Request object
 * @param {object} res  - Response object
 * @param {function} next - next middlware function
 * @returns {object} success message of deletion as a response
 */
exports.delete = async (req, res, next) => {

    let commentInfo = await COMMENT.findOne({ _id: req.params.id, isDeleted: false });
    let postInfo = await POST.findOne({ _id: commentInfo.post, isDeleted: false });
    if (postInfo) {
        if (postInfo.user == req.user._id || req.user.role == "admin") {
            const comment = await COMMENT.findOneAndUpdate({ _id: commentInfo._id, isDeleted: false }, { $set: { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() } }, { new: true });
            await USER.findOneAndUpdate({ _id: req.user_id, isDeleted: false }, { $pull: { comments: req.params.id } });
            await POST.findOneAndUpdate({ _id: postInfo._id, isDeleted: false }, { $pull: { comments: req.params.id } });
            return res.sendJson(200, {message : "Comment deleted Successfully"})
        } else {
            if (commentInfo.user == req.user._id) {
                const comment = await COMMENT.findOneAndUpdate({ _id: req.params._id, isDeleted: false }, { $set: { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() } }, { new: true });
                await USER.findOneAndUpdate({ _id: postInfo.user, isDeleted: false }, { $pull: { comments: req.params.id } });
                await POST.findOneAndUpdate({ _id: postInfo._id, isDeleted: false }, { $pull: { comments: req.params.id } });
                return res.sendJson(200, {message : "Comment deleted Successfully"})
            } else
                throw new APIError({ message: "You cannot delete someone's comment" });
        }
    } else
        throw new APIError({ status: 401, message: "You can only delete comments from own post's" })
}