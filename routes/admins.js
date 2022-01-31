const express = require("express");
const { adminpost, adminget } = require("../controllers/admin");
const router = express.Router();

// the routes
router.route("/register").post(adminpost);
router.route("/").get(adminget)

module.exports = router