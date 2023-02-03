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
} = require("../controllers/userController");

const router = express.Router();

router.route("/totalBookmarks").get(verifyUser, getTotalBookmarks);
router.route("/total").get(getTotalUsers);
router
    .route("/:id")
    .patch(verifyUser, updateUser) //* use "userImage" in fie;d to upload
    .delete(verifyUser, deleteUser)
    .get(getUser);
router
    .route("/bookmarks/:id")
    .patch(verifyUser, handleBookmark)
    .get(getAllBookmarks);
router.route("/userLikes/:id").get(verifyUser, getUserLikes);
router.route("/").get(verifyAdmin, getAllUsers);

module.exports = router;
