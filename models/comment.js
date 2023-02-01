const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        comments: [
            {
                name: { type: String },
                email: { type: String },
                message: { type: String },
                likes: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        default: [],
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

commentSchema.pre(/^find/, function (next) {
    this.populate({ path: "postId" });
    next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
