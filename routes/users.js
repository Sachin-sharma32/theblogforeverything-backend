const express = require("express");
const { verifyAdmin, verifyUser } = require("../controllers/authController");
const {
  updateUser,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  handleBookmark,
  checkBookmark,
  getUserLikes,
  getAllBookmarks,
  getTotalUsers,
  getTotalBookmarks,
  getUserPosts,
  getAllUsersCms,
  getAllAdminsCms,
} = require("../controllers/userController");

const router = express.Router();

router.route("/posts/:id").get(getUserPosts);
router.route("/cms").get(getAllUsersCms);
router
  .route("/:id")
  .patch(verifyUser, updateUser)
  .delete(verifyUser, deleteUser)
  .get(getUser);
router.route("/totalBookmarks").get(verifyUser, getTotalBookmarks);
router.route("/total").get(getTotalUsers);
router
  .route("/bookmarks/:id")
  .patch(verifyUser, handleBookmark)
  .get(getAllBookmarks);
router.route("/userLikes/:id").get(verifyUser, getUserLikes);
router.route("/").get(getAllUsers);
router.route("/admins/cms").get(getAllAdminsCms);

module.exports = router;
