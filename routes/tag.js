const express = require("express");
const { verifyAdmin, verifyUser } = require("../controllers/authController");
const router = express.Router();

const {
    getAllTags,
    createTag,
    deleteTag,
    updateTag,
    getTag,
    getPostsByTag,
    getTotalTags
} = require("../controllers/tagController");

router.route('/total').get(verifyUser, getTotalTags)
router.route("/").get(getAllTags).post(verifyAdmin, createTag);
router
    .route("/:id")
    .delete(verifyAdmin, deleteTag)
    .patch(verifyAdmin, updateTag)
    .get(getTag);
router.route("/posts/:id").get(verifyUser, getPostsByTag);
module.exports = router;
