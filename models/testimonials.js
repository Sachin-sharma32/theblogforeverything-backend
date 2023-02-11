const mongoose = require("mongoose");

const testimonailSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        message: { type: String },
        image: String,
    },
    {
        timestamps: true,
    }
);

testimonailSchema.pre(/^find/, function (next) {
    this.populate({ path: "user" });
    next();
});

const Testimonial = new mongoose.model("Testimonial", testimonailSchema);
module.exports = Testimonial;
