const Category = require("../models/category.js");
const catchAsync = require("../utils/catchAsync.js");
const Post = require("../models/post.js");
const AppError = require("../utils/AppError.js");

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, image, desc, header, footer, topCategory } = req.body;
    const exist = await Category.findOne({
        title: { $regex: new RegExp(req.body.title, "i") },
        _id: { $ne: id },
    });
    if (exist) {
        return next(
            new AppError("Category with this name already exists", 400)
        );
    }
    const updatedDoc = await Category.findByIdAndUpdate(
        id,
        { title, image, desc, header, footer, topCategory },
        {
            // runValidators: true,
            new: true,
        }
    );
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
    console.log(req.body.title);
    const exists = await Category.findOne({
        title: { $regex: new RegExp(req.body.title, "i") },
    });
    if (exists) {
        return next(
            new AppError("Category with this name already exists", 400)
        );
    }
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
        category: { $in: [id] },
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
