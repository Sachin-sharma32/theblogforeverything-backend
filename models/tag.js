const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: String,
        footer: Boolean,
    },
    {
        timestamps: true,
    }
);

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
