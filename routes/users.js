const express = require("express");
const { userregister, userget, userlogin } = require("../controllers/user");
const { protect } = require("../middleware/auth");
const router = express.Router();

// routes
router.route("/register").post(userregister);
router.route("/login").post(userlogin)
router.route("/").get(protect, userget)

module.exports = router