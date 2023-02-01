const express = require("express");
const {
    createPost,
    getAllPosts,
    getPost,
    deletePost,
    updatePost,
    getBestPost,
    handleLike,
    totalPosts,
    getUsersByBookmark,
    getTotalLikes,
} = require("../controllers/postController");

const {
    verifyToken,
    verifyAdmin,
} = require("../controllers/authController.js");

const router = express.Router();
router.route("/bestPost/best").get(getBestPost);
router.route("/total").get(totalPosts);
router.route("/totalLikes").get(getTotalLikes);

router
    .route("/:id")
    .patch(verifyAdmin, updatePost)
    .delete(verifyAdmin, deletePost)
    .get(verifyToken, getPost);
router.route("/likes/:id").patch(verifyToken, handleLike);
router.route("/bookmarks/:id").get(verifyToken, getUsersByBookmark);
router.route("/").get(verifyToken, getAllPosts).post(verifyAdmin, createPost);
module.exports = router;
