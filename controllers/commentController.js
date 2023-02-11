const Comment = require("../models/comment");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.deleteComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({
        status: "deleted",
    });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const docs = await Comment.findOne({
        postId: { $in: [id] },
    });
    // .select({ comments: 1, _id: 0, postId: 0 });
    docs;
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.getComment = catchAsync(async (req, res, next) => {
    const { commentsId } = req.params;
    let comments = await Comment.findById(commentsId);
    const doc = comments.comments.find((comment) => {
        return comment._id == req.params.commentId;
    });
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.createComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findOne({
        postId: { $in: [id] },
    });
    comment.comments.push(req.body);
    const doc = await Comment.findByIdAndUpdate(comment._id, comment);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.handleLike = catchAsync(async (req, res, next) => {
    const { commentsId } = req.params;
    let comments = await Comment.findById(commentsId);
    const comment = comments.comments.find((comment) => {
        return comment._id == req.params.commentId;
    });
    const userId = req.body.userId;

    if (!comment) {
        return next(new AppError("Comment not found", 404));
    }

    let exist;
    if (comment.likes.length > 0) {
        exist = comment.likes.find((like) => {
            return like == userId;
        });
    }
    if (exist) {
        const index = comment.likes.indexOf(exist);
        comment.likes.splice(index, 1);
    } else {
        comment.likes.push(userId);
    }

    const doc = await Comment.findByIdAndUpdate(commentsId, comments, {
        // runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.getTotalComments = catchAsync(async (req, res, next) => {
    const documents = await Comment.find();
    const comments = documents.map((document) => document.comments);
    const totalComments = comments.reduce((acc, val) => acc + val.length, 0);
    res.status(200).json({
        status: "success",
        data: {
            totalComments,
        },
    });
});
