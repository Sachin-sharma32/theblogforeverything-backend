const Category = require("../models/category.js");
const catchAsync = require("../utils/catchAsync.js");
const Post = require("../models/post.js");

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Category.findByIdAndUpdate(id, req.body, {
        // runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: "success",
        data: updatedDoc,
    });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        message: "deleted",
    });
});

exports.getAllCategories = catchAsync(async (req, res) => {
    const docs = await Category.find();
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.createCategory = catchAsync(async (req, res, next) => {
    const doc = await Category.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Category.findById(id);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.getPostsByCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const posts = await Post.find({
        categories: { $in: [id] },
    });
    res.status(200).json({
        status: "success",
        data: {
            posts,
        },
    });
});

exports.getTotalCategories = catchAsync(async (req, res, next) => {
    const totalCategories = await Category.countDocuments();
    res.status(200).json({
        status: "success",
        data: {
            totalCategories,
        },
    });
});
