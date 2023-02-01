const express = require("express");
const {
    createComment,
    getComment,
    getAllComments,
    deleteComment,
    handleLike,
    getTotalComments,
} = require("../controllers/commentController");

const {
    verifyToken,
    verifyAdmin,
} = require("../controllers/authController.js");

const router = express.Router();

router.route("/total").get(getTotalComments);
router.route("/comment/:id").delete(verifyAdmin, deleteComment);
router
    .route("/:id")
    .post(verifyToken, createComment)
    .get(verifyToken, getAllComments);

router
    .route("/:commentsId/comment/:commentId")
    .patch(verifyToken, handleLike)
    .get(getComment);

module.exports = router;
