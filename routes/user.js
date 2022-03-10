const express = require("express");
const router = express.Router();

const {
	registerUser,
	userLogin,
	userForgotPassword,
	userResetPassword
} = require("../controllers/users");

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/forgotpassword").post(userForgotPassword);
router.route("/resetpassword/:resetToken").put(userResetPassword);

module.exports = router