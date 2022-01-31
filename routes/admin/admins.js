const express = require("express");
const { adminpost, adminget } = require("../../controllers/admin/admin");
const router = express.Router();

// the routes
router.route("/").post(adminpost);
router.route("/").get(adminget)

module.exports = router