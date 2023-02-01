const express = require("express");
const {
    createUser,
    logIn,
    logOut,
    refresh,
    forgetPassword,
    resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(logIn);
router.route("/logout").post(logOut);
router.route("/refresh").get(refresh);
router.route("/forgotPassword").post(forgetPassword);
router.route("/resetPassword/:resetToken").post(resetPassword);

module.exports = router;
