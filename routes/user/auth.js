const express = require("express");
const { authController } = require("../../controllers/user/auth");
const router = express.Router()

// routes
router.route("/").post(authController)

module.exports = router