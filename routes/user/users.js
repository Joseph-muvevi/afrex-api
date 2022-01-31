const express = require("express");
const { userpost, userget } = require("../../controllers/user/user");
const router = express.Router();

// routes
router.route("/").post(userpost);
router.route("/").get(userget)

module.exports = router