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
  getTotalTags,
  getAllTagsCms,
} = require("../controllers/tagController");

router.route("/total").get(getTotalTags);
router.route("/").get(getAllTags).post(verifyAdmin, createTag);
router.route("/cms").get(getAllTagsCms);
router
  .route("/:id")
  .delete(verifyAdmin, deleteTag)
  .patch(verifyAdmin, updateTag)
  .get(getTag);
router.route("/posts/:id").get(getPostsByTag);
module.exports = router;
