const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    ],
});

bookmarkSchema.pre(/^find/, function (next) {
    this.populate({
        path: "posts.post",
    });
    next();
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
