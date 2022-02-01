const express = require("express");
const { userregister, userget, userlogin } = require("../controllers/user");
const { protectUser } = require("../middleware/auth");
const router = express.Router();

// routes
router.route("/register").post(userregister);
router.route("/login").post(userlogin);
router.route("/forgotpassword").post();
router.route("/").get(protectUser, userget);

module.exports = router