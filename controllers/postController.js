const Comment = require("../models/comment");
const Like = require("../models/like");
const Post = require("../models/post");
const User = require("../models/user");
const ApiFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.updatePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Post.findByIdAndUpdate(id, req.body, {
        // runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: "success",
        data: updatedDoc,
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.status(200).json({
        status: "deleted",
        data: {
            post,
        },
    });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Post.find(), req.query)
        .pagination()
        .sort();
    const docs = await features.query;
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Post.findById(id);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const doc = await Post.create(req.body);
    await Like.create({ postId: doc._id, users: [] });
    await Comment.create({ postId: doc._id, comments: [] });
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.getBestPost = catchAsync(async (req, res, next) => {
    const doc = await Post.find({
        bestPost: { $in: [true] },
    });
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.handleLike = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    const userId = req.body.userId;

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    let exist;
    if (post.likes.length > 0) {
        exist = post.likes.find((like) => {
            return like == userId;
        });
    }
    if (exist) {
        const index = post.likes.indexOf(exist);
        post.likes.splice(index, 1);
    } else {
        post.likes.push(userId);
    }

    const doc = await Post.findByIdAndUpdate(post._id, post, {
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

exports.totalPosts = catchAsync(async (req, res, next) => {
    const total = await Post.countDocuments();
    res.status(200).json({
        status: "success",
        data: {
            total,
        },
    });
});

exports.getTotalLikes = catchAsync(async (req, res, next) => {
    const posts = await Post.find();
    const totalLikes = posts.reduce((acc, post) => {
        return acc + post.likes.length;
    }, 0);
    res.status(200).json({
        status: "success",
        data: {
            totalLikes,
        },
    });
});

exports.getUsersByBookmark = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const users = await User.find({
        bookmarks: { $in: [id] },
    });
    console.log(users);
    res.status(200).json({
        status: "success",
        data: {
            users,
        },
    });
});
