const Post = require("../models/post");
const Tag = require("../models/tag");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getAllTags = catchAsync(async (req, res, next) => {
    const docs = await Tag.find();
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.getTag = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Tag.findById(id);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.deleteTag = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Tag.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        message: "deleted",
    });
});

exports.updateTag = catchAsync(async (req, res, next) => {
    const exist = await Tag.findOne({
        title: { $regex: new RegExp(req.body.title, "i") },
    });
    if (exist) {
        return next(new AppError("Tag with this name already exists", 400));
    }
    const { id } = req.params;
    const doc = await Tag.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.createTag = catchAsync(async (req, res, next) => {
    const exist = await Tag.findOne({
        title: { $regex: new RegExp(req.body.title, "i") },
    });
    if (exist) {
        return next(new AppError("Tag with this name already exists", 400));
    }
    const doc = await Tag.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.getPostsByTag = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const posts = await Post.find({
        tags: { $in: [id] },
    });
    res.status(200).json({
        status: "success",
        data: {
            posts,
        },
    });
});

exports.getTotalTags = catchAsync(async (req, res, next) => {
    const totalTags = await Tag.countDocuments();
    res.status(200).json({
        status: "success",
        data: {
            totalTags,
        },
    });
});

exports.getAllTagsCms = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Tag.find(), req.query)
      .pagination()
      .sort()
      .filter();
    const docs = await features.query;
    const total = await Tag.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        docs,
        total,
      },
    });
  });
