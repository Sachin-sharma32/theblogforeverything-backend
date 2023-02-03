const express = require("express");
const {
    createUser,
    logIn,
    logOut,
    refresh,
    forgetPassword,
    resetPassword,
    verifyEmail,
    register,
} = require("../controllers/authController");

const router = express.Router();

router.route("/resetPassword/:resetToken").post(resetPassword);
router.route("/verifyEmail").post(verifyEmail);
router.route("/register").get(register);
router.route("/login").post(logIn);
router.route("/logout").post(logOut);
router.route("/refresh").get(refresh);
router.route("/forgotPassword").post(forgetPassword);

module.exports = router;
