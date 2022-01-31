const express = require("express");
const { route } = require("express/lib/application");
const { userregister, userget, userlogin } = require("../controllers/user");
const router = express.Router();

// routes
router.route("/register").post(userregister);
router.route("/login").post(userlogin)
router.route("/").get(userget)

module.exports = router