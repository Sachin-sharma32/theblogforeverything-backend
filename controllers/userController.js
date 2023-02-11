const User = require("../models/user");
const cryptoJs = require("crypto-js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post");

exports.updateUser = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { id } = req.params;

    if (req.body.password) {
        req.body.password = cryptoJs.AES.encrypt(
            req.body.password,
            process.env.CRYPTO_SECRET
        ).toString();
    }

    const updatedDoc = await User.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: "success",
        data: updatedDoc,
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({
        status: "deleted",
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const docs = await User.find();
    docs;
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.getMe = catchAsync(async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    if (!token) {
        res.status(500).json({ message: "authorization token not provided" });
    }
    const decoded = jwt.verify(token, "sachin1234");
    const user = await User.findOne({ _id: decoded.id })
        .populate("bookmarks")
        .populate("posts")
        .populate("preferences");
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await User.findById(id)
        .populate("bookmarks")
        .populate("preferences")
        .populate("posts");
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.handleBookmark = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let user = await User.findById(id);
    const postId = req.body.postId;

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    let exist;
    if (user.bookmarks.length > 0) {
        exist = user.bookmarks.find((post) => {
            return post._id == postId;
        });
    }

    if (exist) {
        const index = user.bookmarks.indexOf(exist);
        user.bookmarks.splice(index, 1);
    } else {
        user.bookmarks.push(postId);
    }

    const doc = await User.findByIdAndUpdate(user._id, user, {
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

exports.getUserLikes = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    const posts = await Post.find({
        likes: { $in: [user._id] },
    });
    res.status(200).json({
        status: "success",
        data: {
            posts,
        },
    });
});

exports.getAllBookmarks = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    id;
    const bookmarks = await User.findById(id)
        .select("bookmarks")
        .populate("bookmarks");
    res.status(200).json({
        status: "success",
        data: {
            bookmarks,
        },
    });
});

exports.getTotalUsers = catchAsync(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    res.status(200).json({
        status: "success",
        data: {
            totalUsers,
        },
    });
});

exports.getTotalBookmarks = catchAsync(async (req, res, next) => {
    const users = await User.find();
    const totalBookmarks = users.reduce((acc, user) => {
        return acc + user.bookmarks.length;
    }, 0);
    totalBookmarks;
    res.status(200).json({
        status: "success",
        data: {
            totalBookmarks,
        },
    });
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const docs = await Post.find({
        author: { $in: [id] },
    });
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});
