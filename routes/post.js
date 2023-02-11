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
    getRelatedPosts,
    searchPosts,
} = require("../controllers/postController");

const {
    verifyToken,
    verifyAdmin,
} = require("../controllers/authController.js");

const router = express.Router();
router.route("/bestPost").get(getBestPost);
router.route("/").get(getAllPosts).post(verifyAdmin, createPost);
router.route("/total").get(totalPosts);
router.route("/totalLikes").get(getTotalLikes);
router.route("/relatedPosts/:id").get(getRelatedPosts);

router
    .route("/:id")
    .patch(verifyAdmin, updatePost)
    .delete(verifyAdmin, deletePost)
    .get(getPost);
router.route("/likes/:id").patch(verifyToken, handleLike);
router.route("/bookmarks/:id").get(getUsersByBookmark);
module.exports = router;
