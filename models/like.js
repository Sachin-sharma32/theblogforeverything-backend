const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        users: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

likeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "users.user",
    }).populate({
        path: "postId",
    });
    next();
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
