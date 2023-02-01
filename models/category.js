const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        image: String,
        topCategory: Boolean,
        header: Boolean,
        footer: Boolean,
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
