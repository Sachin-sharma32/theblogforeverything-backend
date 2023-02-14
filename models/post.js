const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Tag",
            },
        ],
        type: {
            type: String,
            enum: {
                values: ["blog", "short", "experience", "information"],
                message: "Type can only be blog|short|experience|information",
            },
        },
        content: {
            type: String,
            required: true,
        },
        image: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        featured: Boolean,
        bestPost: Boolean,
        readTime: Number,
        summery: String,
    },
    { timestamps: true }
);

postSchema.pre(/^find/, function (next) {
    this.populate("author")
        .populate({
            path: "category",
        })
        .populate({
            path: "tags",
        })
        .populate({
            path: "likes",
        });
    next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
