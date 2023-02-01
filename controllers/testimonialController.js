const Testimonial = require("../models/testimonials");
const catchAsync = require("../utils/catchAsync");

exports.getAllTestimonials = catchAsync(async (req, res, next) => {
    const docs = await Testimonial.find();
    res.status(200).json({
        status: "success",
        data: {
            docs,
        },
    });
});

exports.createTestimonial = catchAsync(async (req, res, next) => {
    const doc = await Testimonial.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});
